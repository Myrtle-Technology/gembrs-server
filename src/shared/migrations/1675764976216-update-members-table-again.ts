import { getDb } from '../migrations-utils/db';

export const up = async () => {
  const db = await getDb();
  const members = db.collection('members');
  const users = db.collection('users');

  const cursor = members.find();
  while (await cursor.hasNext()) {
    const member = await cursor.next();
    const user = await users.findOne({ _id: member.user });
    await members.updateOne(
      { _id: member._id },
      {
        $set: {
          userName: `${user.firstName} ${user.lastName}`,
          userEmail: user.email,
          userPhone: user.phone,
        },
      },
    );
  }
};

export const down = async () => {
  const db = await getDb();
  /*
      Code you downgrade script here!
   */
};
