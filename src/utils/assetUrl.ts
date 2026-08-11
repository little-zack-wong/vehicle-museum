/**
 * 资源路径工具：兼容 GitHub Pages 子路径部署。
 * vite base='./' 时 BASE_URL 为 './'，相对当前页面解析，
 * 在 GitHub Pages 子路径（/vehicle-museum/）下也能正确加载。
 */
export function assetUrl(path: string): string {
  const base: string = (import.meta.env.BASE_URL as string) || './'
  // path 如 '/models/car.glb' → 去掉开头的 '/'，拼上 base
  return `${base}${path.replace(/^\//, '')}`
}
