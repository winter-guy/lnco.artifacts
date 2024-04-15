/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/naming-convention */
import { BaseIdentityFormData, BaseIdentity } from './identity.i';

export class UserMetaFormMapper {
    public static mapBasicDetailsForm(form: BaseIdentityFormData, uid: string): BaseIdentity {
        return {
            user_id: uid,
            username: form.username,
            name: form.name,
            user_metadata: {
                profile_info: form.profile,
                secondary_email: form.email,
                about: form.about,
            },
        };
    }

    public static mapResponseToBDForm(res: BaseIdentity): { [key: string]: any } {
        return {
            user_id: res.user_id,
            username: res.username,
            name: res.name,
            profile: res.user_metadata.profile_info,
            email: res.user_metadata.secondary_email,
            about: res.user_metadata.about,
        };
    }
}
