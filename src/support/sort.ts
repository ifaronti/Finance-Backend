
export const sortResponse = (sort: string, createdAt?:string) => {
    let theOrder = {};
    if (sort && sort !== "" ) {
        switch (sort) {
          case "Latest":
            theOrder = createdAt? { createdAt: "desc" }:{date:'desc'}
            break;
          case "Oldest":
            theOrder = createdAt?{ createdAt: "asc" }:{date:'asc'}
            break;
          case "A-Z":
            theOrder = { name: "asc" };
            break;
          case "Z-A":
            theOrder = { name: "desc" };
            break;
          case "Highest":
            theOrder = { amount: "desc" };
            break;
          default:
            theOrder = { amount: "asc" };
        }
        return theOrder
      }
}