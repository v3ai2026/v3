# Contributing to VisionCommerce

Thank you for your interest in contributing to VisionCommerce! This document provides guidelines and instructions for contributing.

## 🌟 How to Contribute

### Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/v3ai2026/vision-.git
   cd vision-
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce** the behavior
- **Expected behavior**
- **Actual behavior**
- **Screenshots** if applicable
- **Environment details** (browser, OS, device)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Clear title and description**
- **Detailed explanation** of the proposed functionality
- **Use cases** and benefits
- **Possible implementation** approach

### Pull Requests

1. **Fork** the repository
2. **Create a branch** from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes** following our coding standards
4. **Test your changes** thoroughly
5. **Run quality checks** before committing:
   ```bash
   npm run lint        # Check code style
   npm run format      # Format code
   npm run build       # Verify build
   ```
6. **Commit** with clear, descriptive messages (see Commit Messages section)
7. **Push** to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
8. **Open a Pull Request** with a clear description

## 📝 Coding Standards

### TypeScript/JavaScript

- Use **TypeScript** for all new code
- Follow **ESLint** configuration
- Use **functional components** with hooks
- Write **JSDoc comments** for public APIs
- Keep functions **small and focused**
- Use **meaningful variable names**

### React Components

```typescript
// Good example
interface ProductViewerProps {
  product: Product3D;
  onVariantChange?: (variant: ProductVariant) => void;
}

export const ProductViewer: React.FC<ProductViewerProps> = ({
  product,
  onVariantChange
}) => {
  // Component implementation
};
```

### File Naming

- **Components**: PascalCase (e.g., `ProductViewer.tsx`)
- **Utilities**: camelCase (e.g., `modelLoader.ts`)
- **Types**: PascalCase (e.g., `Product3D`)
- **Hooks**: camelCase with `use` prefix (e.g., `useMediaPipeFace.ts`)

### Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

Format:
```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting)
- `refactor:` Code refactoring
- `perf:` Performance optimization
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

Example:
```
feat(ar): add AR glasses try-on feature

- Implement MediaPipe face tracking
- Add glasses overlay rendering
- Support multiple product variants

Closes #123
```

## 🧪 Testing

### Running Tests

```bash
npm test                 # Run all tests
npm test:watch          # Run tests in watch mode
npm test:coverage       # Generate coverage report
```

### Writing Tests

- Write tests for **new features**
- Maintain **test coverage** above 80%
- Use **descriptive test names**
- Test **edge cases** and error conditions

```typescript
describe('ProductViewer', () => {
  it('should render product with correct name', () => {
    // Test implementation
  });

  it('should handle variant change', () => {
    // Test implementation
  });
});
```

## 🔍 Code Review Process

All submissions require review before merging:

1. **Automated checks** must pass (lint, tests, build)
2. **At least one approval** from a maintainer
3. **All conversations resolved**
4. **Up to date** with main branch

Please read [CODE_REVIEW.md](CODE_REVIEW.md) for detailed code review standards and [CODE_REVIEW_CHECKLIST.md](CODE_REVIEW_CHECKLIST.md) for the review checklist.

### Pre-Commit Checks

The project uses Git hooks to ensure code quality. Before each commit:
- ESLint checks for code issues
- Prettier formats your code
- Type checking validates TypeScript

These checks run automatically via Husky and lint-staged.

## 📦 Project Structure

```
visioncommerce/
├── components/          # React components
│   ├── 3d/             # 3D visualization
│   ├── ar/             # AR features
│   ├── ai/             # AI services
│   └── social/         # Social features
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries
├── services/           # API services
├── types/              # TypeScript types
└── docs/               # Documentation
```

## 🌐 Internationalization (i18n)

When adding user-facing text:

1. Add strings to language files in `locales/`
2. Use translation hooks: `useTranslation()`
3. Support both English and Chinese

## ♿ Accessibility

Ensure your contributions are accessible:

- Use **semantic HTML**
- Provide **alt text** for images
- Support **keyboard navigation**
- Test with **screen readers**
- Maintain **color contrast** ratios

## 🔐 Security

- **Never commit** sensitive data (API keys, passwords)
- **Validate user input** on both client and server
- **Sanitize data** before rendering
- Report security issues via **private disclosure**

## 📄 Documentation

Update documentation for:

- **New features**: Add user guides
- **API changes**: Update API documentation
- **Breaking changes**: Add migration guide

## 💬 Communication

- **GitHub Issues**: Bug reports and feature requests
- **Pull Requests**: Code contributions and discussions
- **Discussions**: General questions and ideas

## 📜 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## 🙏 Recognition

Contributors will be:

- Listed in the **CONTRIBUTORS.md** file
- Mentioned in **release notes**
- Recognized in the **project README**

---

**Thank you for contributing to VisionCommerce! Together, we're building the future of AR commerce.** 🚀
