import Pusher from "pusher";
import asyncHandler from "express-async-handler";

const pusher = new Pusher({
    appId: "1491546",
    key: "8d3ec624039a7cb81849",
    secret: "1af156ad319231c15617",
    cluster: "ap1",
    useTLS: true
  });

const getHook = asyncHandler(async (req, res) => {
    pusher.trigger("my-channel", "my-event", {
      message: "success"
    });
    res.send("hook send done")
})

export {getHook}

  