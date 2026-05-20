# Build for linkrunner-labs/docs.
# Mintlify is SaaS-first and has no static build output, so we ship the
# `mintlify dev` server inside a container and front it with the
# haproxy-public ingress on GKE (docs.bkp.linkrunner.io).
#
# Image is pushed to asia-south1-docker.pkg.dev/lr-prod-482009/docs/docs
# by .github/workflows/prod-docs-image-build.yml on `prod-v*` tags.

FROM node:20-alpine

# Non-root user (uid/gid 1000 matches the chart's securityContext).
RUN addgroup -g 1000 -S app && adduser -u 1000 -S app -G app

WORKDIR /app

# Install the Mintlify CLI globally so the runtime image doesn't need to
# resolve it from node_modules on every start.
RUN npm install -g mintlify@latest

# Copy the docs sources. The CLI walks the working directory at boot, so we
# bring the whole repo in (mdx pages, docs.json, images, snippets, etc.).
COPY --chown=app:app . .

USER app

# Mintlify writes cache state under $HOME/.mintlify; the chart mounts an
# emptyDir there so the read-only-rootfs path stays safe.
ENV HOME=/home/app

EXPOSE 3001

# `mintlify dev --port 3001` is the only currently-supported way to serve a
# Mintlify project locally. Bind to 0.0.0.0 so the container is reachable.
CMD ["mintlify", "dev", "--port", "3001"]
