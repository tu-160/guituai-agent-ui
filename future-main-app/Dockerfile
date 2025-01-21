# 基础镜像
# nodejs请勿使用alpine版本，以免出现依赖安装失败的问题
FROM node:16.20.2 as build-stage
LABEL maintainer=future-team

ENV TZ=Asia/Shanghai

# 指定临时工作目录
WORKDIR /temp

# 安装pnpm
RUN npm install -g pnpm@8.15.7

# 复制项目
COPY . .

# 安装依赖
RUN pnpm install --registry https://registry.npmmirror.com

# 构建项目
RUN pnpm build

# 基础镜像
FROM nginx:1.25.2-alpine as production-stage

# 指定运行时的工作目录
ENV WORKDIR /wwwroot/future/future-web-vue3
WORKDIR $WORKDIR

# 将构建文件拷贝到运行时目录中
COPY --from=build-stage /temp/dist ${WORKDIR}

# 复制Nginx配置
COPY deploy/default.conf /etc/nginx/conf.d/

# 指定容器内运行端口
EXPOSE 80
