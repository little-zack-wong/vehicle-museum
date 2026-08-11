#!/usr/bin/env python3
"""Generate Chinese toddler-friendly narration audio for each vehicle via edge-tts."""
import asyncio, os, sys

VOICE = "zh-CN-XiaoxiaoNeural"  # clear friendly female voice
RATE = "+10%"  # slightly slower for kids
PITCH = "+5Hz"

VEHICLES = {
    "car": "这是小汽车，爸爸开车带我们去公园玩。",
    "taxi": "这是出租车，黄色的，招手就能坐。",
    "sports-car": "这是跑车，跑得特别快！",
    "suv": "这是越野车，力气大，可以去爬山。",
    "police-car": "这是警车，警察叔叔抓坏人用的，呜哇呜哇！",
    "fire-truck": "这是消防车，红色的，着火的时候去救火，呜——",
    "ambulance": "这是救护车，有人生病的时候，飞快地送他去医院。",
    "bus": "这是公交车，长长的，可以坐很多人。",
    "dump-truck": "这是翻斗车，它的大斗可以翘起来，把沙子倒出来。",
    "bulldozer": "这是推土机，力气特别大，用大铲子把土推平。",
    "crane": "这是吊车，长长的吊臂，能把很重的东西吊起来。",
    "tractor": "这是拖拉机，农民伯伯用它耕田种地。",
}

out_dir = sys.argv[1] if len(sys.argv) > 1 else "/tmp/vehicle-museum/public/audio"
os.makedirs(out_dir, exist_ok=True)

from edge_tts import Communicate

async def gen(name, text):
    dest = os.path.join(out_dir, f"{name}.mp3")
    if os.path.exists(dest) and os.path.getsize(dest) > 1000:
        print(f"skip {name} (exists)")
        return
    com = Communicate(text, VOICE, rate=RATE, pitch=PITCH)
    await com.save(dest)
    print(f"ok {name} -> {dest} ({os.path.getsize(dest)} bytes)")

async def main():
    for name, text in VEHICLES.items():
        try:
            await gen(name, text)
        except Exception as e:
            print(f"FAIL {name}: {e}")

asyncio.run(main())
