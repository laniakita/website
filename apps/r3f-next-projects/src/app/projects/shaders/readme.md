# Shader Collection

These are shaders that assumes they're being applied to meshes using the Three.js shaderMaterial function. Many global directives are defined by Three (projectionMatrix, modelViewMatrix, position, etc.), but aren't actually defined locally in these tiny vertex/fragment files, hence the GLSL Linting errors.

Aswell, I'm fairly certain Three.js adds the '#version 300 es' directive by default, so I've ommited these statements, much to the pain of the glsl-linter extension I'm using.
