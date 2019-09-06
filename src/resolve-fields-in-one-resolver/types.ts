interface IUser {
  userId: string;
  userNme: string;
  userEmail: string;
}

interface IPost {
  postId: string;
  postTitle: string;
  postCreatedAt: string;
  postAuthorId: string;
}

interface IMemoryDB {
  users: IUser[];
  posts: IPost[];
}

export { IUser, IPost, IMemoryDB };
