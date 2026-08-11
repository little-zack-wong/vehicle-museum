# 🚗 汽车小博物馆

给 3 岁孩子准备的 3D 汽车科普小网站。参照 [prehistoric-animal-museum](https://github.com/s010s/prehistoric-animal-museum) 的亲子向设计理念：

- 点一辆车，拖拽旋转、缩放仔细看
- 点「听一听」播放童声中文介绍（不自动播放）
- 大按钮、大卡片，3 岁孩子也能自己玩
- 无广告、无统计、无登录

## 车型（12 辆）

| 分类 | 车型 |
| --- | --- |
| 🚗 小汽车 | 小汽车、越野车、跑车、出租车 |
| 🚨 特种车 | 警车、消防车、救护车、公交车 |
| 🚧 工程车 | 翻斗车、推土机、吊车、拖拉机 |

## 技术栈

- Vite + React 19 + TypeScript
- three.js（GLTFLoader + OrbitControls，原生控制器，不依赖 react-three-fiber）
- edge-tts 预生成中文旁白（静态 MP3）
- @fontsource 中文字体（Noto Sans SC + ZCOOL 快乐体）

## 本地运行

```bash
npm install
npm run dev
```

## 模型来源

poly.pizza 上 Quaternius 的 CC0 低多边形车辆模型（可免费商用，详见各模型页版权说明）。

## 重新生成语音

```bash
python3 scripts/gen_audio.py
```

## 部署

静态站点，`npm run build` 后把 `dist/` 扔到任意静态托管即可（GitHub Pages / Cloudflare Pages / 内网服务器）。
