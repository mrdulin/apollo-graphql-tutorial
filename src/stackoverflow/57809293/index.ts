class UserAPI {
  public async getPlanById(planId) {
    const promise1 = Promise.resolve({ user_ids: [1, 2] });
    const promise2 = Promise.resolve();

    const objToReturn = await Promise.all([promise1, promise2])
      .then(([snapshot1, snapshot2]) => {
        return snapshot1.user_ids;
      })
      .then((userIds) => {
        return this.getUsersFromUserIds(userIds).then((usersArray) => {
          return usersArray;
        });
      });
    return objToReturn;
  }

  public async getUsersFromUserIds(userIds) {
    return [
      { id: 1, name: 'a' },
      { id: 2, name: 'b' },
    ];
  }
}

const userAPI = new UserAPI();
userAPI.getPlanById(1).then((objToReturn) => {
  console.log('objToReturn: ', objToReturn);
});
