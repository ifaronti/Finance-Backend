
export const sortResponse = (sort: string, createdAt?:string) => {
    let theOrder = {};
    if (sort && sort !== "" ) {
        switch (sort) {
          case "Latest":
            theOrder = createdAt? 'bill_day."createdAt" DESC'.replace("'", ''):{date:'desc'}
            break;
          case "Oldest":
            theOrder = createdAt?'bill_day."createdAt" ASC'.replace("'", ''):{date:'asc'}
            break;
          case "A-Z":
            theOrder = createdAt? 'bill_day.name DESC'.replace("'", ''):{ name: "asc" };
            break;
          case "Z-A":
            theOrder = createdAt? 'bill_day.name ASC'.replace("'", ''):{ name: "desc" };
            break;
          case "Highest":
            theOrder = createdAt? 'bill_day.amount DESC'.replace("'", ''):{ amount: "desc" };
            break;
          case "Lowest":
            theOrder = createdAt ? 'bill_day.amount ASC'.replace("'", '') : { amount: "asc" };
            break
        }
        return theOrder
      }
}