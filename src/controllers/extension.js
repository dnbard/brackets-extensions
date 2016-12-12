var winston = require('winston'),
    _ = require('lodash'),
    RegistryDAL = require('../DAL/registry'),
    Q = require('q'),
    Response = require('../response'),
    converters = require('../services/converters'),
    request = require('request');

function getReadmeFile(repository) {
    var readmePathEndings = ['/master/README.md', '/master/Readme.md', '/master/readme.md'],
        endingIndex = 0,
        readmePathBase;

    if (!repository || repository.indexOf('https://github.com/') === -1) {
        return Promise.resolve(null);
    }

    readmePathBase = repository.replace('https://github.com/', 'https://raw.githubusercontent.com/');

    if (readmePathBase[readmePathBase.length - 1] === '/') {
        readmePathBase = readmePathBase.substring(0, readmePathBase.length - 1);
    }

    return new Promise((resolve, reject) => {
        function makeReadmeRequest(url) {
            request(url, (err, response, body) => {
                if (err || body === 'Not Found') {
                    endingIndex++;

                    if (endingIndex === readmePathEndings.length) {
                        return resolve(null);
                    }

                    return makeReadmeRequest(readmePathBase + readmePathEndings[endingIndex]);
                }

                console.log('%s - %s', url, err);
                return resolve(body.replace(/\/blob\//g, '/raw/'));
            });
        }

        return makeReadmeRequest(readmePathBase + readmePathEndings[endingIndex]);
    });
}

exports.default = function(req, res, next){
    var extensionId = req.params.id;

    if (!extensionId){
        res.status(500).send();
        return;
    }

    Q.all([
        RegistryDAL.getExtension(extensionId),
        RegistryDAL.getTagsAsObject()
    ]).then(result => {
        var extension = result[0].metadata,
            registryEntry = result[0],
            tags = result[1],
            dailyUsers = 0;

        const readMeUrl = extension.repository ? extension.repository.url :
            extension.homepage ? extension.homepage : null;

        // getReadmeFile(readMeUrl).then(readme => {
            console.log(readme);

            res.render('extension', new Response(req, {
                id: extension.name,
                title : extension.title || extension.name,
                author: {
                    name: extension.author.name.replace(/\b(\w)+\@(\w)+\.(\w)+\b/g, '').replace(',', '').trim(),
                    link: extension.author.url || null,
                    avatar: null,
                    homepage: extension.author.url || null
                },
                description: extension.description,
                github: {
                    forks: null,
                    stars: null
                },
                created: _.first(registryEntry.versions).published,
                latest: _.last(registryEntry.versions).published,
                totalDownloads: 0,
                version: extension.version,
                homepage: null,
                repository: extension.repository ? extension.repository.url : null,
                license: registryEntry.metadata.license,
                engines: registryEntry.metadata.engines || null,
                keywords: registryEntry.metadata.keywords || null,
                versions: registryEntry.versions ? _.clone(registryEntry.versions).reverse() : null,
                tags: tags,
                user: req.user,
                dailyUsers: dailyUsers,
                isFaked: false,
                // readme: readme
            }));
        // });
    }, () => {
        res.render('not-found', new Response(req, {
            title: 'Extension not found',
            type: 'Extension',
            id: extensionId
        }));
    });
}
