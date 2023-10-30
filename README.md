# gle-scene-components
A component library for building 3D scenes.

## Documentation
[Storybook](https://guyettinger.github.io/gle-scene-components/)

## Development
Install
```
npm install
```
Build Library
```
npm run build
```
Run Tests
```
npm run test
```
Run Storybook
```
npm run storybook
```

## Configure Resium
Follow the [Resium Install Guide ](https://resium.reearth.io/installation)

## Configure Cross-origin Isolation
Gaussian Splatting Shared Memory requires [Cross-origin Isolation to be configured](https://web.dev/articles/coop-coep) in deployment.

This can be achieved by setting response headers on your server:
```
response.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
response.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
```
... or deploying [coi-serviceworker](https://github.com/gzuidhof/coi-serviceworker) in your webpage:
```html
<script src="coi-serviceworker.js"></script>
```