/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3500197394")

  // remove field
  collection.fields.removeById("url1542800728")

  return app.save(collection)
}, (app) => {
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

  return app.save(collection)
})
