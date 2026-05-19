FROM nginx:alpine
COPY . /usr/share/nginx/html/
RUN rm -f /usr/share/nginx/html/Dockerfile /usr/share/nginx/html/SPEC_REBUILD.md /usr/share/nginx/html/.DS_Store
EXPOSE 80
