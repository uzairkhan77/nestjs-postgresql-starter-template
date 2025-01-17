export type PaginatedResponse<T> = {
    data: T[]
    total: number | null
    totalPages: number | null
    currentPage: number
}

export type dashboardUsersCounts = {
    totalUsers: number
    completedOrders: number
    onGoingOrders: number
}
