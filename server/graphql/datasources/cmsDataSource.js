const { Op } = require('sequelize')
const { DataSource } = require('apollo-datasource');
const data = require('../../data')

const Mappers = {
    Site: site => ({
        id: site.id,
        name: site.name
    })
}

class CmsDataSource extends DataSource {
    constructor() {
        super()
    }

    async getSites() {
        var sites = await data.Site.findAll();
        sites = sites.map(Mappers.Site)
        return sites;
    }

    async upsertSite(site) {
        if (!site.data) { site.data = {} }
        if (site.id) {
            await data.Site.update(site, {where: { id: { [Op.eq]: site.id } } });
            return site;
        } else {
            const createdSite = await data.Site.create(site);
            return Mappers.Site(createdSite)
        }
    }

    async deleteSite(siteId) {
        await data.Site.destroy({
            where: {
                id: siteId
            }
        })
    }
}

module.exports = CmsDataSource;