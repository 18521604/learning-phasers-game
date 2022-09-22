export default {
    addCollider(otherGameobject: any, callback: any) {
        this.scene.physics.add.collider(
            this,
            otherGameobject,
            callback,
            null,
            this
        );
        return this;
    },
};
