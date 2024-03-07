import { Item } from "./item.model";
import { UserRequest } from "./user.model";

export interface Order {
    id?: string;
    completed?: boolean;
    date?: Date;
    user_id?: UserRequest;
    user_token?: any;
    total?: Float64Array;
    new_item?: string;
    items?: Item[];
}
