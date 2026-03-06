import { Link } from 'react-router-dom'
import { Package, Tag, Truck, ArrowLeftRight, Users, Search, FileX, Inbox, FolderOpen } from 'lucide-react'

const emptyStatePresets = {
  products: {
    icon: Package,
    title: 'No products yet',
    description: 'Get started by adding your first product to track inventory.',
    actionLabel: 'Add Product',
    actionTo: '/dashboard/products',
    color: '#4f46e5',
  },
  categories: {
    icon: Tag,
    title: 'No categories',
    description: 'Create categories to organize your products better.',
    actionLabel: 'Add Category',
    actionTo: '/dashboard/categories',
    color: '#10b981',
  },
  suppliers: {
    icon: Truck,
    title: 'No suppliers',
    description: 'Add your first supplier to manage your supply chain.',
    actionLabel: 'Add Supplier',
    actionTo: '/dashboard/suppliers',
    color: '#f59e0b',
  },
  movements: {
    icon: ArrowLeftRight,
    title: 'No stock movements',
    description: 'Record stock in or out to track inventory changes.',
    actionLabel: 'Record Movement',
    actionTo: '/dashboard/movements',
    color: '#3b82f6',
  },
  users: {
    icon: Users,
    title: 'No team members',
    description: 'Invite team members to collaborate on inventory management.',
    actionLabel: 'Invite Member',
    color: '#8b5cf6',
  },
  search: {
    icon: Search,
    title: 'No results found',
    description: 'Try adjusting your search or filter criteria.',
    color: '#6b7280',
  },
  error: {
    icon: FileX,
    title: 'Something went wrong',
    description: 'We encountered an error loading this data. Please try again.',
    color: '#ef4444',
  },
  generic: {
    icon: Inbox,
    title: 'Nothing here yet',
    description: 'This section is empty. Add some data to get started.',
    color: '#6b7280',
  },
}

export default function EmptyState({ 
  type = 'generic', 
  icon: CustomIcon,
  title,
  description,
  actionLabel,
  actionTo,
  onAction,
  color,
  compact = false,
}) {
  const preset = emptyStatePresets[type] || emptyStatePresets.generic
  
  const Icon = CustomIcon || preset.icon
  const finalTitle = title || preset.title
  const finalDescription = description || preset.description
  const finalActionLabel = actionLabel || preset.actionLabel
  const finalActionTo = actionTo || preset.actionTo
  const finalColor = color || preset.color

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: compact ? '32px 20px' : '60px 20px',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          width: compact ? 60 : 80,
          height: compact ? 60 : 80,
          borderRadius: '50%',
          background: finalColor + '15',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: compact ? 16 : 24,
        }}
      >
        <Icon size={compact ? 28 : 36} color={finalColor} />
      </div>

      <h3
        style={{
          fontSize: compact ? 16 : 20,
          fontWeight: 700,
          color: 'var(--text)',
          marginBottom: 8,
        }}
      >
        {finalTitle}
      </h3>

      <p
        style={{
          fontSize: compact ? 13 : 15,
          color: 'var(--text-muted)',
          maxWidth: 360,
          lineHeight: 1.5,
          marginBottom: finalActionLabel ? (compact ? 16 : 24) : 0,
        }}
      >
        {finalDescription}
      </p>

      {finalActionLabel && (finalActionTo || onAction) && (
        finalActionTo ? (
          <Link
            to={finalActionTo}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: compact ? '10px 20px' : '12px 24px',
              borderRadius: 10,
              background: finalColor,
              color: 'white',
              fontSize: compact ? 13 : 14,
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'all 0.2s',
            }}
          >
            {finalActionLabel}
          </Link>
        ) : (
          <button
            onClick={onAction}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: compact ? '10px 20px' : '12px 24px',
              borderRadius: 10,
              background: finalColor,
              color: 'white',
              fontSize: compact ? 13 : 14,
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {finalActionLabel}
          </button>
        )
      )}
    </div>
  )
}
