import { AppUser } from '../schemas/app-user.schema';

export class AppUserListItem {
    role: {
        name: string;
        displayName: string;
        description: string;
    };
    user: {
        id: string;
        email: string;
        name: string;
    };
    addedDate: Date;
}

export class AppUserList {
    private userList: AppUserListItem[] = [];

    constructor(users: AppUser[]) {
        this.userList = this.constructAppUserList(users);
    }

    getUserList() {
        return this.userList;
    }

    private constructAppUserList(users: AppUser[]) {
        return users.map((user) => {
            const userItem = new AppUserListItem();
            userItem.role = {
                name: (user.role as any).name,
                displayName: (user.role as any).displayName,
                description: (user.role as any).description,
            };
            (userItem.user = {
                id: (user.user as any)?.id,
                email:
                    (user.user as any)?.email ||
                    (user.invitation as any)?.email,
                name: (user.user as any)?.name || '',
            }),
                (userItem.addedDate = user.addedDate);

            return userItem;
        });
    }
}
