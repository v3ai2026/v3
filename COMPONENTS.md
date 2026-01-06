# DeployHub Component Documentation

Complete reference for all components in the DeployHub component library.

## Table of Contents

- [UI Components](#ui-components)
- [Data Display Components](#data-display-components)
- [Layout Components](#layout-components)
- [Advanced Components](#advanced-components)

---

## UI Components

### Button

Multi-functional button component with various styles and states.

**Props:**
- `variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost'` - Button style (default: 'primary')
- `size?: 'sm' | 'md' | 'lg'` - Button size (default: 'md')
- `type?: 'button' | 'submit' | 'reset'` - HTML button type (default: 'button')
- `disabled?: boolean` - Disable button (default: false)
- `loading?: boolean` - Show loading spinner (default: false)
- `iconLeft?: Component` - Icon to display on the left
- `iconRight?: Component` - Icon to display on the right
- `fullWidth?: boolean` - Make button full width (default: false)

**Events:**
- `click: (event: MouseEvent) => void` - Emitted when button is clicked

**Example:**
```vue
<Button variant="primary" :iconLeft="Rocket" @click="handleClick">
  Deploy Now
</Button>

<Button variant="danger" size="sm" :loading="isLoading">
  Delete
</Button>
```

---

### Input

Advanced input field with icon support and validation.

**Props:**
- `id?: string` - Input ID attribute
- `type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url'` - Input type (default: 'text')
- `modelValue?: string | number` - v-model value
- `label?: string` - Label text
- `placeholder?: string` - Placeholder text
- `disabled?: boolean` - Disable input (default: false)
- `required?: boolean` - Required field (default: false)
- `error?: string` - Error message to display
- `hint?: string` - Hint text to display
- `iconLeft?: Component` - Icon on the left side
- `iconRight?: Component` - Icon on the right side

**Events:**
- `update:modelValue: (value: string | number) => void` - v-model update
- `blur: (event: FocusEvent) => void` - Input blur event
- `focus: (event: FocusEvent) => void` - Input focus event

**Example:**
```vue
<Input
  v-model="email"
  type="email"
  label="Email"
  placeholder="you@example.com"
  required
  :iconLeft="Mail"
  :error="emailError"
/>
```

---

### Card

Flexible card container with header, body, and footer sections.

**Props:**
- `hover?: boolean` - Enable hover effect (default: false)
- `gradient?: boolean` - Use gradient background (default: false)
- `padding?: 'none' | 'sm' | 'md' | 'lg'` - Card padding (default: 'md')

**Slots:**
- `header` - Card header content
- `default` - Card body content
- `footer` - Card footer content

**Example:**
```vue
<Card hover gradient>
  <template #header>
    <h3>Card Title</h3>
  </template>
  <p>Card content goes here</p>
  <template #footer>
    <Button>Action</Button>
  </template>
</Card>
```

---

### Badge

Status badge component with various colors.

**Props:**
- `variant?: 'success' | 'error' | 'warning' | 'info' | 'default'` - Badge color (default: 'default')
- `icon?: Component` - Optional icon

**Example:**
```vue
<Badge variant="success" :icon="CheckCircle">
  Active
</Badge>
```

---

### Modal

Modal dialog with customizable size and behavior.

**Props:**
- `isOpen: boolean` - Modal visibility state
- `size?: 'sm' | 'md' | 'lg' | 'xl'` - Modal size (default: 'md')
- `showClose?: boolean` - Show close button (default: true)
- `closeOnBackdrop?: boolean` - Close when clicking backdrop (default: true)

**Events:**
- `close: () => void` - Emitted when modal should close

**Slots:**
- `header` - Modal header content
- `default` - Modal body content
- `footer` - Modal footer content

**Example:**
```vue
<Modal :isOpen="modalOpen" @close="modalOpen = false">
  <template #header>
    <h3>Confirm Action</h3>
  </template>
  <p>Are you sure you want to proceed?</p>
  <template #footer>
    <Button @click="modalOpen = false">Cancel</Button>
    <Button variant="primary" @click="confirm">Confirm</Button>
  </template>
</Modal>
```

---

### Dropdown

Dropdown menu with custom positioning.

**Props:**
- `position?: 'left' | 'right'` - Dropdown alignment (default: 'right')

**Slots:**
- `trigger: { isOpen: boolean }` - Dropdown trigger element
- `default: { close: () => void }` - Dropdown menu content

**Example:**
```vue
<Dropdown position="right">
  <template #trigger="{ isOpen }">
    <Button>Options</Button>
  </template>
  <template #default="{ close }">
    <button @click="handleEdit(close)">Edit</button>
    <button @click="handleDelete(close)">Delete</button>
  </template>
</Dropdown>
```

---

### Tabs

Tab navigation component with icon support.

**Props:**
- `tabs: Array<{ label: string, icon?: Component }>` - Tab configuration
- `initialTab?: number` - Initially active tab (default: 0)

**Events:**
- `change: (index: number) => void` - Emitted when tab changes

**Slots:**
- `tab-{index}` - Content for each tab (e.g., `tab-0`, `tab-1`)

**Example:**
```vue
<Tabs :tabs="[
  { label: 'Overview', icon: LayoutDashboard },
  { label: 'Settings', icon: Settings }
]" @change="handleTabChange">
  <template #tab-0>
    <p>Overview content</p>
  </template>
  <template #tab-1>
    <p>Settings content</p>
  </template>
</Tabs>
```

---

### Tooltip

Hover tooltip with multiple positioning options.

**Props:**
- `text: string` - Tooltip text
- `position?: 'top' | 'bottom' | 'left' | 'right'` - Tooltip position (default: 'top')
- `delay?: number` - Show delay in ms (default: 200)

**Example:**
```vue
<Tooltip text="Click to deploy" position="top">
  <Button>Deploy</Button>
</Tooltip>
```

---

## Data Display Components

### StatsCard

Data statistics card with trend indicators.

**Props:**
- `title: string` - Card title
- `value: number` - Numeric value
- `icon: Component` - Icon component
- `iconColor?: 'blue' | 'green' | 'purple' | 'orange'` - Icon background color (default: 'blue')
- `trend?: number` - Trend percentage (positive or negative)
- `format?: 'number' | 'currency' | 'percentage'` - Value format (default: 'number')

**Example:**
```vue
<StatsCard
  title="Total Projects"
  :value="24"
  :icon="FolderGit2"
  iconColor="blue"
  :trend="12.5"
/>
```

---

### Table

Data table with custom cell rendering.

**Props:**
- `columns: Array<{ key: string, label: string }>` - Column configuration
- `data: Array<any>` - Table data

**Slots:**
- `cell-{key}: { row: any, value: any }` - Custom cell renderer for each column

**Example:**
```vue
<Table :columns="columns" :data="users">
  <template #cell-status="{ value }">
    <Badge :variant="value">{{ value }}</Badge>
  </template>
  <template #cell-actions="{ row }">
    <Button @click="edit(row)">Edit</Button>
  </template>
</Table>
```

---

### SearchBar

Search input with icon.

**Props:**
- `modelValue?: string` - v-model value
- `placeholder?: string` - Placeholder text (default: 'Search...')

**Events:**
- `update:modelValue: (value: string) => void` - v-model update

**Example:**
```vue
<SearchBar v-model="searchQuery" placeholder="Search projects..." />
```

---

## Layout Components

### Sidebar

Navigation sidebar with menu items.

**Slots:**
- `footer` - Footer content (e.g., user info)

**Example:**
```vue
<Sidebar>
  <template #footer>
    <UserMenu />
  </template>
</Sidebar>
```

---

### Header

Top navigation header with left and right sections.

**Slots:**
- `left` - Left side content
- `right` - Right side content (e.g., theme toggle, notifications)

**Example:**
```vue
<Header>
  <template #left>
    <h1>Dashboard</h1>
  </template>
  <template #right>
    <ThemeToggle />
    <NotificationBell />
    <UserMenu />
  </template>
</Header>
```

---

### DashboardLayout

Complete dashboard layout combining sidebar and header.

**Slots:**
- `sidebar-footer` - Sidebar footer content
- `header-left` - Header left content
- `header-right` - Header right content
- `default` - Main content area

**Example:**
```vue
<DashboardLayout>
  <template #header-right>
    <ThemeToggle />
    <UserMenu />
  </template>
  <div>Main content</div>
</DashboardLayout>
```

---

## Advanced Components

### ThemeToggle

Theme switcher for light/dark mode.

**Example:**
```vue
<ThemeToggle />
```

---

### NotificationBell

Notification dropdown with unread counter.

**Example:**
```vue
<NotificationBell />
```

---

### UserMenu

User profile dropdown menu.

**Example:**
```vue
<UserMenu />
```

---

### ProjectCard

Project information card with actions.

**Props:**
- `project: Project` - Project data object

**Events:**
- `deploy: (project: Project) => void` - Deploy button clicked
- `settings: (project: Project) => void` - Settings button clicked
- `edit: (project: Project) => void` - Edit menu item clicked
- `delete: (project: Project) => void` - Delete menu item clicked

**Example:**
```vue
<ProjectCard
  :project="project"
  @deploy="handleDeploy"
  @delete="handleDelete"
/>
```

---

### DeploymentStatus

Deployment status indicator with progress.

**Props:**
- `deployment: Deployment` - Deployment data object

**Example:**
```vue
<DeploymentStatus :deployment="currentDeployment" />
```

---

### ActivityFeed

Activity timeline feed.

**Props:**
- `activities?: Array<ActivityItem>` - Activity items (optional, includes default data)

**Example:**
```vue
<ActivityFeed :activities="recentActivities" />
```

---

## Composables

### useAuth

Authentication management.

```typescript
const { user, signIn, signUp, signOut } = useAuth()

await signIn('email@example.com', 'password')
await signUp('email@example.com', 'password', 'Full Name')
await signOut()
```

### useNotification

Notification system.

```typescript
const { success, error, warning, info } = useNotification()

success('Success!', 'Operation completed')
error('Error!', 'Something went wrong')
```

### useModal

Modal state management.

```typescript
const { isOpen, open, close, toggle } = useModal()

open() // Show modal
close() // Hide modal
```

### useTheme

Theme management.

```typescript
const { theme, isDark, toggleTheme, setTheme } = useTheme()

toggleTheme() // Switch theme
setTheme('dark') // Set specific theme
```

### useForm

Form validation.

```typescript
const { registerField, setValue, validateAll, getValues } = useForm()

registerField('email', '', [
  { validator: isEmail, message: 'Invalid email' }
])
```

### usePagination

Pagination management.

```typescript
const { currentPage, totalPages, nextPage, previousPage } = usePagination(totalItems)

nextPage()
previousPage()
```

---

## Utility Functions

### Validation (utils/validation.ts)

- `isEmail(email: string): boolean`
- `isRequired(value: string): boolean`
- `minLength(value: string, min: number): boolean`
- `isPassword(password: string): boolean`
- `isUrl(url: string): boolean`
- `isSlug(value: string): boolean`

### Formatting (utils/formatting.ts)

- `formatDate(date: string | Date, format?: 'short' | 'long' | 'relative'): string`
- `formatCurrency(amount: number, currency?: string): string`
- `formatNumber(num: number, decimals?: number): string`
- `formatBytes(bytes: number, decimals?: number): string`
- `truncate(text: string, maxLength?: number): string`

---

## Type Definitions

See `types/index.ts` for complete type definitions:

- `User` - User account information
- `Project` - Project data structure
- `Deployment` - Deployment information
- `Organization` - Organization data
- `Notification` - Notification structure

---

## Best Practices

1. **Component Composition**: Use slots for flexible layouts
2. **Reactive Data**: Use `ref()` and `computed()` for reactive state
3. **Event Handling**: Emit events for parent communication
4. **Type Safety**: Leverage TypeScript interfaces
5. **Accessibility**: Use semantic HTML and ARIA attributes
6. **Performance**: Lazy load heavy components when possible

---

## Need Help?

For questions or issues, please refer to the main README or open an issue on GitHub.
