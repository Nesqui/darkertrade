export default {
  users: [],
  lastQuery: new Date().getHours(),
  clearUsers() {
    this.users = [];
  },
  push(userId: number) {
    this.users.push(userId);
  },
  updateLastQuery() {
    this.lastQuery = new Date().getHours();
  },
};
