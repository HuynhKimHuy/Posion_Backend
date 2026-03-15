export const normalizeUnreadCounts = (value) => {
    if (!value) return {}
    if (value instanceof Map) return Object.fromEntries(value.entries())
    if (typeof value.toJSON === "function") return value.toJSON()
    return { ...value }
}

export const ensureUnreadCountsMap = (conversation) => {
    if (conversation?.unreadCounts instanceof Map) {
        return conversation.unreadCounts
    }

    const normalized = normalizeUnreadCounts(conversation?.unreadCounts)
    const map = new Map(Object.entries(normalized))

    if (conversation) {
        conversation.unreadCounts = map
    }

    return map
}