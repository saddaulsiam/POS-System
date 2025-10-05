# RefreshButton Component - Quick Reference

## 🎨 Component Variants

```tsx
import { RefreshButton } from "../components/common";
```

### Variant 1: Default (with text)

```tsx
<RefreshButton onClick={handleRefresh} loading={isLoading} />
```

**Renders:**

```
┌──────────────────┐
│  🔄  Refresh     │
└──────────────────┘
```

**Use Cases:**

- Main section headers
- Dashboard cards
- Primary refresh actions

---

### Variant 2: Icon-Only

```tsx
<RefreshButton onClick={handleRefresh} loading={isLoading} variant="icon-only" />
```

**Renders:**

```
┌──────┐
│  🔄  │
└──────┘
```

**Use Cases:**

- Toolbars
- Compact layouts
- Space-constrained areas

---

## 📊 Props Reference

| Prop        | Type                       | Default     | Description              |
| ----------- | -------------------------- | ----------- | ------------------------ |
| `onClick`   | `() => void`               | Required    | Click handler function   |
| `loading`   | `boolean`                  | `false`     | Shows spinning animation |
| `disabled`  | `boolean`                  | `false`     | Disables the button      |
| `variant`   | `"default" \| "icon-only"` | `"default"` | Button style             |
| `className` | `string`                   | `""`        | Additional CSS classes   |

---

## 🎭 States

### Normal State

```
┌──────────────────┐
│  🔄  Refresh     │  ← White bg, shadow, clickable
└──────────────────┘
```

### Loading State

```
┌──────────────────┐
│  ⟳  Refresh     │  ← Spinning icon, disabled
└──────────────────┘
```

### Disabled State

```
┌──────────────────┐
│  🔄  Refresh     │  ← 50% opacity, not clickable
└──────────────────┘
```

### Hover State

```
┌──────────────────┐
│  🔄  Refresh     │  ← Larger shadow, bg change
└──────────────────┘
```

---

## 📍 Current Usage

### Admin Dashboard

**Location:** Key Metrics header  
**Variant:** Default  
**Code:**

```tsx
<RefreshButton onClick={loadDashboardData} loading={isLoading} />
```

---

### Analytics Page

**Location:** Page header toolbar  
**Variant:** Icon-Only  
**Code:**

```tsx
<RefreshButton onClick={fetchAnalytics} loading={refreshing} variant="icon-only" />
```

---

### Loyalty Dashboard

**Location:** Component header  
**Variant:** Default  
**Code:**

```tsx
<RefreshButton
  onClick={() => {
    fetchLoyaltyData();
    onRefresh?.();
  }}
  loading={loading}
/>
```

---

## 🎨 Style Specifications

### Default Variant

```
Background:      white
Text Color:      gray-700
Font Weight:     medium
Padding:         16px (x), 8px (y)
Border Radius:   8px
Shadow:          sm → md (on hover)
Icon Size:       20px
Gap:             8px
Transition:      200ms
```

### Icon-Only Variant

```
Background:      blue-500 → blue-600 (on hover)
Text Color:      white
Padding:         8px
Border Radius:   8px
Icon Size:       20px
Transition:      200ms
```

---

## 💡 Tips

1. **Use Default variant** when space allows and action is primary
2. **Use Icon-Only variant** in toolbars or compact layouts
3. **Always pass loading state** for visual feedback
4. **Combine with other states** using disabled prop if needed

---

## ⚡ Quick Copy-Paste

### Basic Implementation

```tsx
import { RefreshButton } from "../components/common";

function MyComponent() {
  const [loading, setLoading] = useState(false);

  const handleRefresh = async () => {
    setLoading(true);
    try {
      await fetchData();
    } finally {
      setLoading(false);
    }
  };

  return <RefreshButton onClick={handleRefresh} loading={loading} />;
}
```

### With Error Handling

```tsx
const handleRefresh = async () => {
  setLoading(true);
  try {
    await fetchData();
    toast.success("Data refreshed!");
  } catch (error) {
    toast.error("Failed to refresh");
  } finally {
    setLoading(false);
  }
};

return <RefreshButton onClick={handleRefresh} loading={loading} />;
```

---

**Component File:** `frontend/src/components/common/RefreshButton.tsx`  
**Documentation:** `docs/recent-updates/REFRESH_BUTTON_STANDARDIZATION.md`
