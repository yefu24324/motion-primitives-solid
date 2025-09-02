import fs from "fs";
import path from "path";

const DIST_DIR = "./.output/public";
const NGINX_STATIC_DIR = "C:/Users/24324/Desktop/workspace/docker/nginx/nginx/static/motion-primitives-solid"; // 默认nginx静态目录，可根据需要修改

function copyRecursive(src, dest) {
  const stat = fs.statSync(src);

  if (stat.isDirectory()) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }

    const files = fs.readdirSync(src);
    files.forEach((file) => {
      copyRecursive(path.join(src, file), path.join(dest, file));
    });
  } else {
    fs.copyFileSync(src, dest);
    console.log(`已复制: ${src} -> ${dest}`);
  }
}

function main() {
  try {
    // 检查dist目录是否存在
    if (!fs.existsSync(DIST_DIR)) {
      console.error(`错误: ${DIST_DIR} 目录不存在`);
      process.exit(1);
    }

    // 检查nginx目录是否存在，不存在则创建
    if (!fs.existsSync(NGINX_STATIC_DIR)) {
      console.log(`创建目录: ${NGINX_STATIC_DIR}`);
      fs.mkdirSync(NGINX_STATIC_DIR, { recursive: true });
    }

    console.log(`开始复制 ${DIST_DIR} 到 ${NGINX_STATIC_DIR}...`);

    // 复制dist目录下的所有文件到nginx静态目录
    const distFiles = fs.readdirSync(DIST_DIR);
    distFiles.forEach((file) => {
      copyRecursive(path.join(DIST_DIR, file), path.join(NGINX_STATIC_DIR, file));
    });

    console.log("复制完成！");
  } catch (error) {
    console.error("复制过程中出现错误:", error.message);
    process.exit(1);
  }
}

main();
