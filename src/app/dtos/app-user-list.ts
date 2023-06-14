import { AppUserStatus } from 'src/common/enums';
import { AppUser } from '../schemas/app-user.schema';

export class AppUserListItem {
    _id: string;
    role: {
        _id: string;
        name: string;
        displayName: string;
        description: string;
    };
    user: {
        _id: string;
        email: string;
        name: string;
    };
    invitation: {
        _id: string;
    };
    addedDate: Date;
    status: AppUserStatus;
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
                _id: (user.role as any).id,
                name: (user.role as any).name,
                displayName: (user.role as any).displayName,
                description: (user.role as any).description,
            };
            userItem.user = {
                _id: (user.user as any)?.id,
                email:
                    (user.user as any)?.email ||
                    (user.invitation as any)?.email,
                name: (user.user as any)?.name || '',
            };
            userItem.invitation = {
                _id: (user.invitation as any).id,
            };
            userItem.addedDate = user.addedDate;
            userItem.status = user.status;
            userItem._id = (user as any).id;

            return userItem;
        });
    }
}
