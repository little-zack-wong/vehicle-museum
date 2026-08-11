# 🚗 汽车小博物馆 · Vehicle Museum

> 给 3 岁孩子准备的 3D 汽车科普小网站 —— 一辆车，转一转，听一听。
> A calm 3D vehicle museum for curious little ones (ages 2–6) — spin it, zoom it, hear about it.

**▶ [在线预览 · Live Demo](https://little-zack-wong.github.io/vehicle-museum/)** · 免费 · 无广告 · 无统计 · 无需登录

---

## 简介 · About

参照 [prehistoric-animal-museum](https://github.com/s010s/prehistoric-animal-museum) 的亲子向设计理念，
为孩子做的一个安静、可互动的车辆博物馆：

- 点一辆车，**拖拽旋转、捏合缩放**，360° 仔细看
- 点「听一听」，播放**童声中文介绍**（绝不自动播放）
- **大按钮、大卡片**，3 岁孩子也能自己玩
- 中英双语名称，边玩边学
- 无广告、无统计、无登录，孩子可以放心使用

Inspired by the [prehistoric-animal-museum](https://github.com/s010s/prehistoric-animal-museum),
this is a calm, interactive vehicle museum for kids:

- Tap a vehicle, **drag to rotate, pinch to zoom**, and look at it from every side
- Tap the speaker to hear a **short Mandarin narration** (never auto-plays)
- **Big buttons, big cards** — easy for a 3-year-old to use alone
- Bilingual names (中文 + English)
- No ads, no analytics, no login, no account

## 车型 · Vehicles（13 辆）

| 分类 · Category | 车型 · Vehicles |
| --- | --- |
| 🚗 小汽车 · Cars | 小汽车 Car · 越野车 SUV · 跑车 Sports Car · 出租车 Taxi |
| 🚨 特种车 · Special Vehicles | 警车 Police Car · 消防车 Fire Truck · 救护车 Ambulance · 公交车 Bus |
| 🚧 工程车 · Construction | 翻斗车 Dump Truck · 推土机 Bulldozer · 吊车 Crane · 挖掘机 Excavator · 拖拉机 Tractor |

## 功能亮点 · Features

- 3D 模型：拖拽旋转 / 滚轮缩放 / 自动旋转展示（可暂停）
- 语音旁白：每辆车一句童声中文科普（edge-tts 预生成静态 MP3）
- 左右大箭头切换车辆，无需返回首页
- 每辆车有独立链接（`#/car`、`#/excavator`），方便收藏分享
- WebGL 不可用时自动降级显示提示，不白屏
- 响应式布局，适配手机 / 平板 / 电脑

## 技术栈 · Tech Stack

- Vite + React 19 + TypeScript
- three.js（GLTFLoader + OrbitControls，原生控制器，不依赖 react-three-fiber）
- edge-tts 预生成中文旁白（静态 MP3，无运行时 AI 调用）
- GitHub Actions 自动构建部署 GitHub Pages

## 本地运行 · Run Locally

```bash
npm install
npm run dev
```

生产构建：

```bash
npm run build        # 输出 dist/
npm run preview      # 本地预览构建产物
```

## 模型来源 · Models

[poly.pizza](https://poly.pizza) 上 Quaternius 的 **CC0** 低多边形车辆模型（可免费商用），
挖掘机模型为项目自制。详见各模型页版权说明。

Low-poly vehicle models by [Quaternius](https://poly.pizza) (CC0, free for commercial use);
the excavator model is custom-built for this project.

## 重新生成语音 · Regenerate Audio

```bash
python3 scripts/gen_audio.py
```

## 部署 · Deploy

- 推送 `main` 分支后，GitHub Actions 自动构建并部署到 GitHub Pages
- 也可以手动 `npm run build` 后把 `dist/` 扔到任意静态托管

## 许可 · License

代码 MIT 许可；模型遵循各来源的 CC0 / CC 许可。详见各模型页。

## 致谢 · Credits

- [Quaternius](https://quaternius.com/) — 免费低多边形模型
- [prehistoric-animal-museum](https://github.com/s010s/prehistoric-animal-museum) — 亲子向 3D 博物馆设计灵感
