export const getLastDayOfMonth = () => {
    const month = new Date().getMonth()
    let lastDay = 0
    switch (month) {
        case 2:
            lastDay = 28 | 29
            break
        case 4:
            lastDay = 30
            break
        case 6:
            lastDay = 30
            break
        case 9:
            lastDay = 30
            break
        case 11:
            lastDay = 30
            break
        
        default:
            lastDay = 31
    }
    return lastDay
  }