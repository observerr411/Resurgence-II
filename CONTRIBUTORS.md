# Contributing to Resurgence

We welcome contributions to the Resurgence project! Whether you're fixing bugs, adding features, improving documentation, or sharing ideas, your help makes a real difference in creating a more effective disaster relief platform.

## Our Mission

Resurgence is building blockchain-based disaster relief infrastructure to provide transparent, secure, and efficient humanitarian aid. By contributing, you're helping us save lives and improve disaster response across the globe.

## How to Contribute

### 1. Report Bugs

Found a bug? Help us improve by reporting it!

**Before submitting a bug report:**
- Check the [Issues](https://github.com/observerr411/Resurgence-II/issues) page to see if it's already reported
- Provide a clear, descriptive title
- Include steps to reproduce the issue
- Describe the expected and actual behavior
- Include screenshots or error logs if applicable

**When submitting:**
```markdown
## Description
Brief description of the bug

## Steps to Reproduce
1. ...
2. ...
3. ...

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- OS: [e.g., Ubuntu 24.04]
- Node version: [e.g., 20.x]
- Browser: [if applicable]
```

### 2. Suggest Features

Have an idea to improve Resurgence? We'd love to hear it!

**Before suggesting a feature:**
- Check existing [Issues](https://github.com/observerr411/Resurgence-II/issues) to avoid duplicates
- Check [Discussions](https://github.com/observerr411/Resurgence-II/discussions) for ongoing conversations

**When suggesting:**
```markdown
## Feature Description
What feature would you like to see?

## Use Case
Why is this feature important?

## Proposed Solution
How should it work?

## Alternatives Considered
Other approaches you've thought of
```

### 3. Contribute Code

Ready to code? Awesome! Follow these steps:

#### Setup Development Environment

1. **Fork the repository**
   ```bash
   # Go to https://github.com/observerr411/Resurgence-II
   # Click "Fork" button
   ```

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR-USERNAME/Resurgence-II.git
   cd Resurgence-II
   ```

3. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/observerr411/Resurgence-II.git
   ```

4. **Install dependencies**
   ```bash
   # Frontend
   npm install
   
   # Backend
   cd backend && npm install && cd ..
   
   # Smart Contracts
   cd smartcontract && npm install && cd ..
   ```

5. **Create development branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/bug-description
   ```

#### Development Workflow

1. **Make your changes**
   - Follow the project's code style
   - Write clear, descriptive commit messages
   - Keep commits atomic and focused

2. **Test your changes**
   ```bash
   # Frontend tests
   npm run test
   
   # Linting
   npm run lint
   
   # Build
   npm run build
   ```

3. **Keep your branch updated**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

4. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create a Pull Request**
   - Go to your fork on GitHub
   - Click "Compare & pull request"
   - Fill in the PR template
   - Reference any related issues
   - Wait for review

#### Pull Request Guidelines

- **Title**: Clear, descriptive title (e.g., "Fix: Handle null beneficiary name in form")
- **Description**: Explain what changes and why
- **Type**: Mark as Bug Fix, Feature, Documentation, or Enhancement
- **Testing**: Describe how you tested the changes
- **Checklist**:
  - [ ] Code follows project style guidelines
  - [ ] Self-review completed
  - [ ] Comments added for complex logic
  - [ ] Documentation updated
  - [ ] No new warnings generated
  - [ ] Tests added/updated
  - [ ] All tests passing locally

### 4. Improve Documentation

Good documentation helps everyone!

- **Fix typos**: Typos in docs and comments
- **Add examples**: Create usage examples
- **Improve guides**: Enhance existing guides
- **Translate**: Help translate documentation

Documentation files to improve:
- `README.md` - Project overview
- `FRONTEND_GUIDE.md` - Frontend development guide
- `BACKEND_GUIDE.md` - Backend development guide (when created)
- Smart contract documentation
- API documentation

### 5. Help with Testing

Testing ensures quality. You can help by:
- **Writing tests**: Add unit/integration tests
- **Testing features**: Test new features before release
- **Reporting edge cases**: Find and report edge cases
- **Documentation testing**: Verify docs examples work

## Code Style Guide

### TypeScript/JavaScript

```typescript
// Use semicolons
const myFunction = () => {
  return "value";
};

// Use const/let, avoid var
const x = 1;
let y = 2;

// Use descriptive names
const getUserBeneficiaries = async () => {
  // implementation
};

// Comment complex logic
// Calculate rolling 30-day average of transactions
const getAverageSpending = (transactions: Transaction[]) => {
  // implementation
};
```

### React Components

```typescript
// Use TypeScript with proper types
interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  disabled = false,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
    >
      {label}
    </button>
  );
};
```

### Rust (Smart Contracts)

```rust
// Clear struct documentation
/// Represents an emergency fund on the blockchain
#[derive(Clone)]
pub struct EmergencyFund {
    /// Amount in stroops (1 XLM = 10^7 stroops)
    pub amount: u128,
    /// Type of disaster (earthquake, flood, etc.)
    pub disaster_type: String,
}

// Use constants for magic numbers
const MINIMUM_FUND_AMOUNT: u128 = 1_000_000_000; // 100 XLM
```

### Commit Messages

```
Type: Brief description (50 chars or less)

Optional longer description explaining why the change was made,
what problem it solves, and any relevant context.

Fixes #123
Related to #456
```

**Commit types:**
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (no logic)
- `refactor:` - Code refactoring
- `test:` - Test updates
- `chore:` - Build, dependencies, tooling

Example:
```
feat: Add biometric verification to beneficiary registration

Implements fingerprint and facial recognition options for
beneficiary identity verification as per requirements in issue #123.

Fixes #123
```

## Project Structure

Understanding the project layout helps:

```
Resurgence-II/
├── app/                    # Next.js frontend
│   ├── login/
│   ├── signup/
│   ├── dashboard/
│   └── page.tsx
├── lib/                    # Frontend utilities
│   ├── api.ts
│   ├── auth-context.tsx
│   └── utils.ts
├── backend/                # Express.js backend
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   └── index.ts
│   └── package.json
├── smartcontract/          # Soroban smart contracts
│   ├── src/
│   │   ├── aid_registry.rs
│   │   ├── beneficiary_manager.rs
│   │   └── ...
│   └── Cargo.toml
└── README.md
```

## Development Areas

We have several areas where contributions are most welcome:

### Frontend (Next.js/React)
- [ ] Complete feature pages (edit/detail views)
- [ ] Add form validation
- [ ] Implement real-time updates
- [ ] Add notifications system
- [ ] Improve responsive design
- [ ] Add accessibility features

### Backend (Express.js)
- [ ] Database schema (Prisma)
- [ ] API validation improvements
- [ ] Authentication enhancements
- [ ] Rate limiting refinements
- [ ] Logging improvements
- [ ] Error handling

### Smart Contracts (Soroban/Rust)
- [ ] Enhanced fraud detection
- [ ] Multi-signature improvements
- [ ] Gas optimization
- [ ] Event system expansion
- [ ] Security audits

### Documentation
- [ ] API documentation
- [ ] Deployment guides
- [ ] Architecture diagrams
- [ ] Setup instructions for each component
- [ ] Contributing guide improvements (this file!)

### Testing
- [ ] Unit tests
- [ ] Integration tests
- [ ] E2E tests
- [ ] Smart contract tests
- [ ] Load testing

## Getting Help

- **GitHub Issues**: Ask questions in issue comments
- **GitHub Discussions**: Start discussions in the Discussions tab
- **Documentation**: Check README.md and guides first
- **Code Comments**: Read inline comments for context

## Recognition

Contributors are recognized in:
- GitHub repository contributors list
- Release notes
- Project documentation
- Community acknowledgments

## Code Review Process

1. **Automated checks**: Tests and linting must pass
2. **Code review**: Team reviews for:
   - Code quality
   - Style consistency
   - Documentation
   - Security considerations
   - Performance impact
3. **Feedback**: Address review comments
4. **Approval**: Maintainer approves changes
5. **Merge**: Code is merged to main branch

## Licensing

By contributing to Resurgence, you agree that your contributions will be licensed under the same license as the project (typically MIT). You warrant that you have the right to license the code you're contributing.

## Community Standards

Please see our [Code of Conduct](CODE_OF_CONDUCT.md) for community expectations and standards.

## Questions?

- Open an issue with your question
- Start a discussion in GitHub Discussions
- Check existing issues and documentation

---

**Thank you for helping make Resurgence better!** 🙏

Together, we're building technology to save lives and provide hope in times of crisis.
