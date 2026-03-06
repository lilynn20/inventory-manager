import { useState, useEffect, useRef } from 'react'

/**
 * Activity timeline component showing chronological events
 */
export default function ActivityTimeline({
  activities = [],
  loading = false,
  onLoadMore,
  hasMore = false,
  emptyMessage = 'No activity yet',
}) {
  const [expandedId, setExpandedId] = useState(null)
  const loadMoreRef = useRef(null)

  // Infinite scroll
  useEffect(() => {
    if (!hasMore || !onLoadMore) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !loading) {
          onLoadMore()
        }
      },
      { threshold: 0.1 }
    )

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current)
    }

    return () => observer.disconnect()
  }, [hasMore, loading, onLoadMore])

  const groupActivitiesByDate = (activities) => {
    const groups = {}
    activities.forEach(activity => {
      const date = new Date(activity.timestamp).toDateString()
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(activity)
    })
    return groups
  }

  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return 'Today'
    }
    if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday'
    }
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  const getActivityIcon = (type) => {
    const icons = {
      create: (
        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      ),
      update: (
        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
      delete: (
        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      ),
      stock_in: (
        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      ),
      stock_out: (
        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8V20m0 0l4-4m-4 4l-4-4M7 4v12m0 0l-4-4m4 4l4-4" />
        </svg>
      ),
      login: (
        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
        </svg>
      ),
      comment: (
        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
    }
    return icons[type] || icons.update
  }

  const getActivityColor = (type) => {
    const colors = {
      create: '#10b981',
      update: '#3b82f6',
      delete: '#ef4444',
      stock_in: '#10b981',
      stock_out: '#f59e0b',
      login: '#6366f1',
      comment: '#8b5cf6',
    }
    return colors[type] || '#6b7280'
  }

  const groupedActivities = groupActivitiesByDate(activities)

  if (!loading && activities.length === 0) {
    return (
      <div className="activity-empty">
        <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p>{emptyMessage}</p>
        <style>{`
          .activity-empty {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 3rem;
            color: var(--text-secondary);
            text-align: center;
          }
          .activity-empty svg {
            margin-bottom: 1rem;
            opacity: 0.5;
          }
        `}</style>
      </div>
    )
  }

  return (
    <div className="activity-timeline">
      {Object.entries(groupedActivities).map(([date, items]) => (
        <div key={date} className="activity-date-group">
          <div className="activity-date-header">
            <span className="activity-date-label">{formatDate(date)}</span>
            <span className="activity-date-count">{items.length} activities</span>
          </div>

          <div className="activity-list">
            {items.map((activity, index) => (
              <div
                key={activity.id}
                className={`activity-item ${expandedId === activity.id ? 'expanded' : ''}`}
                onClick={() => setExpandedId(expandedId === activity.id ? null : activity.id)}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div 
                  className="activity-icon"
                  style={{ 
                    background: `${getActivityColor(activity.type)}20`,
                    color: getActivityColor(activity.type),
                  }}
                >
                  {getActivityIcon(activity.type)}
                </div>

                <div className="activity-content">
                  <div className="activity-header">
                    <span className="activity-title">{activity.title}</span>
                    <span className="activity-time">{formatTime(activity.timestamp)}</span>
                  </div>
                  
                  <p className="activity-description">{activity.description}</p>

                  {activity.user && (
                    <div className="activity-user">
                      {activity.user.avatar ? (
                        <img src={activity.user.avatar} alt="" className="activity-user-avatar" />
                      ) : (
                        <div className="activity-user-avatar activity-user-initials">
                          {activity.user.name.charAt(0)}
                        </div>
                      )}
                      <span>{activity.user.name}</span>
                    </div>
                  )}

                  {expandedId === activity.id && activity.details && (
                    <div className="activity-details">
                      {Object.entries(activity.details).map(([key, value]) => (
                        <div key={key} className="activity-detail-row">
                          <span className="detail-key">{key}:</span>
                          <span className="detail-value">{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="activity-line" />
              </div>
            ))}
          </div>
        </div>
      ))}

      {hasMore && (
        <div ref={loadMoreRef} className="activity-load-more">
          {loading ? (
            <div className="activity-loading">
              <div className="spinner" />
              <span>Loading more...</span>
            </div>
          ) : (
            <button onClick={onLoadMore}>Load more activity</button>
          )}
        </div>
      )}

      <style>{`
        .activity-timeline {
          position: relative;
        }

        .activity-date-group {
          margin-bottom: 1.5rem;
        }

        .activity-date-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.5rem 0;
          margin-bottom: 0.75rem;
          border-bottom: 1px solid var(--border);
        }

        .activity-date-label {
          font-weight: 600;
          color: var(--text);
        }

        .activity-date-count {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }

        .activity-list {
          position: relative;
        }

        .activity-item {
          position: relative;
          display: flex;
          gap: 1rem;
          padding: 1rem;
          margin-left: 1rem;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.2s;
          animation: slideIn 0.3s ease both;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .activity-item:hover {
          background: var(--bg-secondary);
        }

        .activity-item.expanded {
          background: var(--bg-secondary);
        }

        .activity-line {
          position: absolute;
          left: -0.5rem;
          top: 2.5rem;
          bottom: -0.5rem;
          width: 2px;
          background: var(--border);
        }

        .activity-item:last-child .activity-line {
          display: none;
        }

        .activity-icon {
          position: relative;
          z-index: 1;
          flex-shrink: 0;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
        }

        .activity-content {
          flex: 1;
          min-width: 0;
        }

        .activity-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          margin-bottom: 0.25rem;
        }

        .activity-title {
          font-weight: 500;
          color: var(--text);
        }

        .activity-time {
          font-size: 0.75rem;
          color: var(--text-secondary);
          flex-shrink: 0;
        }

        .activity-description {
          margin: 0;
          font-size: 0.875rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }

        .activity-user {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 0.5rem;
          font-size: 0.75rem;
          color: var(--text-secondary);
        }

        .activity-user-avatar {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          object-fit: cover;
        }

        .activity-user-initials {
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--primary);
          color: white;
          font-size: 0.625rem;
          font-weight: 600;
        }

        .activity-details {
          margin-top: 0.75rem;
          padding: 0.75rem;
          background: var(--bg);
          border-radius: 6px;
          border: 1px solid var(--border);
          animation: fadeIn 0.2s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .activity-detail-row {
          display: flex;
          gap: 0.5rem;
          font-size: 0.875rem;
          padding: 0.25rem 0;
        }

        .detail-key {
          color: var(--text-secondary);
          text-transform: capitalize;
        }

        .detail-value {
          color: var(--text);
          font-weight: 500;
        }

        .activity-load-more {
          text-align: center;
          padding: 1rem;
        }

        .activity-load-more button {
          padding: 0.5rem 1rem;
          border: 1px solid var(--border);
          border-radius: 6px;
          background: var(--bg);
          color: var(--text);
          cursor: pointer;
          transition: all 0.2s;
        }

        .activity-load-more button:hover {
          background: var(--bg-secondary);
        }

        .activity-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          color: var(--text-secondary);
        }

        .activity-loading .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid var(--border);
          border-top-color: var(--primary);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

/**
 * Compact activity feed for sidebar/widget
 */
export function ActivityFeed({ activities = [], maxItems = 5 }) {
  const displayActivities = activities.slice(0, maxItems)

  return (
    <div className="activity-feed">
      {displayActivities.map(activity => (
        <div key={activity.id} className="feed-item">
          <div className="feed-dot" style={{ background: getActivityColor(activity.type) }} />
          <div className="feed-content">
            <span className="feed-text">{activity.title}</span>
            <span className="feed-time">
              {formatRelativeTime(activity.timestamp)}
            </span>
          </div>
        </div>
      ))}
      <style>{`
        .activity-feed {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .feed-item {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          padding: 0.5rem;
          border-radius: 6px;
          transition: background 0.2s;
        }

        .feed-item:hover {
          background: var(--bg-secondary);
        }

        .feed-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          margin-top: 0.375rem;
          flex-shrink: 0;
        }

        .feed-content {
          flex: 1;
          min-width: 0;
        }

        .feed-text {
          display: block;
          font-size: 0.875rem;
          color: var(--text);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .feed-time {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }
      `}</style>
    </div>
  )
}

function getActivityColor(type) {
  const colors = {
    create: '#10b981',
    update: '#3b82f6',
    delete: '#ef4444',
    stock_in: '#10b981',
    stock_out: '#f59e0b',
    login: '#6366f1',
    comment: '#8b5cf6',
  }
  return colors[type] || '#6b7280'
}

function formatRelativeTime(timestamp) {
  const now = new Date()
  const date = new Date(timestamp)
  const diff = Math.floor((now - date) / 1000)

  if (diff < 60) return 'Just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`
  
  return date.toLocaleDateString()
}
