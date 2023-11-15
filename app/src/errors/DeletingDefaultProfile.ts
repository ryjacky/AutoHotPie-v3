export class DeletingDefaultProfile extends Error {
    constructor() {
        super('Cannot delete the default profile');
    }
}
