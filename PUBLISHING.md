# Publishing Guide

This document explains how to publish this library to npm.

## Pre-Publishing Checklist

1. **Update package.json metadata:**
   - [ ] Update `version` field (follow [semver](https://semver.org/))
   - [ ] Update `author` field with your name and email
   - [ ] Review package `name` (currently: `2d-physics-engine`)
   - [ ] Verify repository, bugs, and homepage URLs

2. **Test the build:**
   ```bash
   npm run build:lib
   ```
   This creates the `dist/` folder with compiled JavaScript and TypeScript declarations.

3. **Run tests:**
   ```bash
   npm test
   ```

4. **Verify the package contents:**
   ```bash
   npm pack --dry-run
   ```
   This shows what files will be included in the published package.

## Publishing Steps

### 1. Login to npm

If you haven't already:
```bash
npm login
```

### 2. Publish

For the first release:
```bash
npm publish
```

For subsequent releases:
```bash
# Update version first
npm version patch  # or minor, or major

# Then publish
npm publish
```

### 3. Publish to a scope (optional)

If you want to use a scoped package name (e.g., `@your-username/2d-physics-engine`):

1. Update `name` in `package.json`:
   ```json
   {
     "name": "@your-username/2d-physics-engine"
   }
   ```

2. Publish with public access:
   ```bash
   npm publish --access public
   ```

## Package Contents

The published package includes:
- `dist/` - Compiled JavaScript and TypeScript declaration files
- `README.md` - Documentation
- `LICENSE` - MIT License

Excluded files (via `.npmignore`):
- Source TypeScript files
- Test files
- Development configuration
- Demo files

## Version Management

Use npm version commands to bump versions:

```bash
npm version patch   # 1.0.0 → 1.0.1 (bug fixes)
npm version minor   # 1.0.0 → 1.1.0 (new features, backward compatible)
npm version major   # 1.0.0 → 2.0.0 (breaking changes)
```

This automatically:
- Updates `package.json` version
- Creates a git tag
- Commits the change

## After Publishing

1. Create a GitHub release with the same version tag
2. Update CHANGELOG.md (if you create one)
3. Share on social media or relevant communities

## Troubleshooting

### Package name already taken
- Use a scoped package: `@your-username/2d-physics-engine`
- Choose a different name

### Permission errors
- Make sure you're logged in: `npm whoami`
- Check if the package name belongs to you

### Build errors
- Ensure TypeScript compiles: `npm run build:lib`
- Check for TypeScript errors
- Verify all dependencies are in `devDependencies`

## Unpublishing

If you need to unpublish (only within 72 hours of publishing):
```bash
npm unpublish <package-name>@<version>
```

For security, npm prevents unpublishing packages that are older than 72 hours or have dependents.

