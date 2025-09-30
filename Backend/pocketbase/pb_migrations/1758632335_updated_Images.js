/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3500197394")

  // add field
  collection.fields.addAt(1, new Field({
    "exceptDomains": null,
    "hidden": false,
    "id": "url1542800728",
    "name": "field",
    "onlyDomains": null,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "url"
  }))

  // add field
  collection.fields.addAt(2, new Field({
    "hidden": false,
    "id": "file54863248",
    "maxSelect": 1,
    "maxSize": 0,
    "mimeTypes": [],
    "name": "svg",
    "presentable": false,
    "protected": false,
    "required": false,
    "system": false,
    "thumbs": [],
    "type": "file"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3500197394")

  // remove field
  collection.fields.removeById("url1542800728")

  // remove field
  collection.fields.removeById("file54863248")

  return app.save(collection)
})
