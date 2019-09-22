// @ts-ignore: '@types/cloudinary officially not available'
import cloudinary from 'cloudinary'
import uuid from 'uuid/v4'

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET
})

export const uploadOneImage = async (stream: any, path: string) => {
	try {
		return new Promise((resolve, reject) => {
			const streamLoad = cloudinary.v2.uploader.upload_stream(
				{ folder: `${process.env.PROJECT_NAME}/${path}`, public_id: uuid() },
				function(error: any, result: any) {
					if (result) {
						resolve(result)
					} else {
						reject(error)
					}
				}
			)
			stream.pipe(streamLoad)
		})
	} catch (err) {
		throw new Error(`Failed to upload the picture ! Err:${err.message}`)
	}
}

// For multiple file upload

/*
  import promisesAll from 'promises-all';

  => In resolver.js
  async multipleFileUpload(parent, {files}) {
    const {resolve, reject} = await promisesAll.all(
        files.map(processUpload)
    );

    if (reject.length) {
        reject.forEach(
            ({name, message}) => {
                console.error(`${name}:${message}`)
            }
        )
    }
    return resolve;
  },
*/

export default cloudinary
