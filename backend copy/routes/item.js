const { Router } = require("express");
const router = Router();
const NOTIFICATION = require("../models/notification");
const upload = require("../middlewares/upload");
const ITEM = require("../models/item");
const cloudinary = require("../services/cloudinary");

router.post("/search", async (req, res) => {
  try {
    const type = req.body.type ? req.body.type : null;
    const search = req.body.searchContent;

    if (type == "User") {
      const items = await ITEM.find({
        createdBy: req.user._id,
        $or: [
          { itemTitle: { $regex: search, $options: "i" } },
          { itemName: { $regex: search, $options: "i" } },
          { itemDesc: { $regex: search, $options: "i" } },
          { location: { $regex: search, $options: "i" } },
        ],
      }).populate("createdBy", "userName");

      return res.status(200).send({ allItem: items });
    } else if (type) {
      const items = await ITEM.find({
        TypeOfItem: type,
        $or: [
          { itemTitle: { $regex: search, $options: "i" } },
          { itemName: { $regex: search, $options: "i" } },
          { itemDesc: { $regex: search, $options: "i" } },
          { location: { $regex: search, $options: "i" } },
        ],
      }).populate("createdBy", "userName");

      return res.status(200).send({ allItem: items });
    }

    const items = await ITEM.find({
      $or: [
        { itemTitle: { $regex: search, $options: "i" } },
        { itemName: { $regex: search, $options: "i" } },
        { itemDesc: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
      ],
    }).populate("createdBy", "userName");

    return res.status(200).send({ allItem: items });
  } catch (err) {
    return res.status(500).send({
      msg: "Internal server error",
      err,
    });
  }
});

router.post("/add", upload.single("image"), async (req, res) => {
  try {
    const itemData = await ITEM.create({
      itemTitle: req.body.title,
      itemName: req.body.name,
      itemDesc: req.body.description,
      location: req.body.location,
      TypeOfItem: req.body.type,
      imageUrl: req.file.path,
      imagePublicId: req.file.filename,
      createdBy: req.user._id,
    });

    const oppositeType = itemData.TypeOfItem === "Lost" ? "Found" : "Lost";

    const candidates = await ITEM.find({
      TypeOfItem: oppositeType,
    });

    function tokenize(str = "") {
      return str
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, "")
        .split(/\s+/)
        .filter(Boolean);
    }

    function hasCommonWord(a = "", b = "") {
      const setA = new Set(tokenize(a));

      for (const word of tokenize(b)) {
        if (setA.has(word)) {
          return true;
        }
      }

      return false;
    }

    let matchC = 0;

    for (const candidate of candidates) {
      if (
        hasCommonWord(itemData.itemTitle, candidate.itemTitle) ||
        hasCommonWord(itemData.itemName, candidate.itemName) ||
        hasCommonWord(itemData.location, candidate.location)
      ) {
        matchC++;
      }
    }

    if (matchC > 0) {
      await NOTIFICATION.create({
        receiver: itemData.createdBy,
        sender: null,
        item: itemData._id,
        isSystemNotification: true,
        message: `We found ${matchC} possible matches for your item "${itemData.itemTitle} - ${itemData.itemName}".`,
      });
    }

    return res.status(200).send({
      matchC,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).send({
      msg: "Internal Server Error",
    });
  }
});

router.get("/", async (req, res) => {
  const allItem = await ITEM.find({}).populate("createdBy", "userName");
  return res.send({
    allItem: allItem,
  });
});

router.get("/user", async (req, res) => {
  const allItem = await ITEM.find({ createdBy: req.user._id }).populate("createdBy", "userName");
  return res.send({
    allItem,
  });
});

router.get("/lost", async (req, res) => {
  const allLost = await ITEM.find({ TypeOfItem: "Lost" }).populate(
    "createdBy",
    "userName",
  );
  return res.send({
    allLost,
  });
});

router.get("/found", async (req, res) => {
  const allFound = await ITEM.find({ TypeOfItem: "Found" }).populate(
    "createdBy",
    "userName",
  );
  return res.send({
    allFound,
  });
});

router.get("/recommend/:itemId", async (req, res) => {
  try {
    const { itemId } = req.params;

    const currentItem = await ITEM.findById(itemId);

    if (!currentItem) {
      return res.status(404).send({
        msg: "Item not found",
      });
    }

    const oppositeType = currentItem.TypeOfItem === "Lost" ? "Found" : "Lost";

    const candidates = await ITEM.find({
      TypeOfItem: oppositeType,
    }).populate("createdBy", "userName");

    function tokenize(str) {
      return str
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, "")
        .split(/\s+/)
        .filter(Boolean);
    }

    function commonWords(a, b) {
      const setA = new Set(tokenize(a));
      const setB = new Set(tokenize(b));

      let count = 0;
      const matchedWords = [];

      for (const word of setA) {
        if (setB.has(word)) {
          count++;
          matchedWords.push(word);
        }
      }

      return {
        count,
        matchedWords,
      };
    }

    const recommendations = [];

    for (const item of candidates) {
      let score = 0;
      let matchedKeywords = [];

      const titleMatch = commonWords(currentItem.itemTitle, item.itemTitle);

      score += titleMatch.count * 5;
      matchedKeywords.push(...titleMatch.matchedWords);

      const nameMatch = commonWords(currentItem.itemName, item.itemName);

      score += nameMatch.count * 3;
      matchedKeywords.push(...nameMatch.matchedWords);

      const locationMatch = commonWords(currentItem.location, item.location);

      score += locationMatch.count * 2;
      matchedKeywords.push(...locationMatch.matchedWords);

      if (score > 0) {
        recommendations.push({
          ...item.toObject(),
          score,
          matchedKeywords: [...new Set(matchedKeywords)],
        });
      }
    }

    recommendations.sort((a, b) => b.score - a.score);

    return res.send({
      currentItem,
      recommendations: recommendations.slice(0, 5),
    });
  } catch (err) {
    console.log(err);

    return res.status(500).send({
      msg: "Internal Server Error",
    });
  }
});

router.post("/claim", async (req, res) => {
  try {
    const { itemId } = req.body;

    const claimer = req.user;
    const item = await ITEM.findById(itemId);
    if (!item) {
      return res.status(404).send({
        msg: "Item not found",
      });
    }

    await ITEM.findByIdAndUpdate(
      itemId,
      {
        $addToSet: {
          claimedBy: claimer._id,
        },
      },
      { returnDocument: "after" },
    );
    const notif = await NOTIFICATION.findOne({
      receiver: item.createdBy,
      sender: claimer._id,
    });

    if (notif) {
      return res.status(400).json({
        msg: "You have already claimed this item",
      });
    }
    await NOTIFICATION.create({
      receiver: item.createdBy,
      sender: claimer._id,
      item: item._id,

      message: `${claimer.userName} has claimed your item "${item.itemTitle} - ${item.itemName}". Contact Email: ${claimer.email}`,
    });

    res.status(200).send({
      msg: "Claim request sent successfully",
    });
  } catch (err) {
    console.log(err);

    res.status(500).send({
      msg: "Internal Server Error",
    });
  }
});

router.post("/remove", async (req, res) => {
  const { itemId } = req.body;

  const item = await ITEM.findById(itemId);
  if (item.imagePublicId) {
    await cloudinary.uploader.destroy(item.imagePublicId);
  }

  if (item.createdBy.toString() !== req.user._id.toString()) {
    return res.status(403).send({
      msg: "Unauthorized",
    });
  }

  await ITEM.findByIdAndDelete(itemId);
  const all = await ITEM.find({});
  return res.send({
    allItem: all,
  });
});

module.exports = router;
