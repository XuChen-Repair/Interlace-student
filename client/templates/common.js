var imageStore = new FS.Store.GridFS("images");

Images = new FS.Collection("images", {
	stores: [imageStore],
	allow: {
    	contentTypes: ['image/*'],
    	extensions: ['png', 'PNG', 'jpg', 'JPG']
	}
});