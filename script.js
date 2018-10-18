class SkeetOverflow {

    constructor(jonSkeetId = '22656', jonSkeetName = 'Jon Skeet') {
        this.jonSkeetId = jonSkeetId
        this.jonSkeetName = jonSkeetName
        this.jonSkeetReputation = 0
    }

    run() {
        this.doGetJonSkeetReputation().then(() => {
            const soUri = (document.URL.split('stackoverflow.com')[1] || '').replace(/\/$/, "")
            const isQuestionTopPage = (soUri == '') || (soUri.indexOf('/?tab') == 0)
            const isQuestionAllOrTaggedPage = (soUri == '/question') || (soUri.indexOf('questions/tagged/') > -1)
            const isQuestionDetailsPage = (soUri.indexOf("/questions/") == 0) && (soUri.split('/')[2] == String(parseInt(soUri.split('/')[2], 10)))
            const isPostRevisionPage = (soUri.indexOf("/posts/") == 0) && (soUri.indexOf("revisions") > -1)
            const isUserProfilePage = (soUri.indexOf("/users/") == 0) && (soUri.split('/')[3].indexOf('profile') > -1 || soUri.indexOf('?tab') == -1)
            const isUserActivityPage = (soUri.indexOf("/users/") == 0) && (soUri.split('/')[3].indexOf('topactivity') > -1)
            const isUserListPage = (soUri == '/users')

            if (soUri.indexOf(`/users/${this.jonSkeetId}`) > -1) {
                console.log(`You are currently accessing stackoverflow profile page of living legend! ${this.jonSkeetName}`)
            }
            
            this.doReplaceMyReputation()
    
            if (isQuestionTopPage) {
                this.doReplaceAllReputationOnQuestionTopPage()
            } else if (isQuestionAllOrTaggedPage) {
                this.doReplaceAllReputationOnQuestionAllOrTaggedPage()
            } else if (isQuestionDetailsPage) {
                this.doReplaceAllReputationOnQuestionDetailsPage()
    
                jQuery('.js-show-link.comments-link').on('click', () => {
                    setTimeout(() => {
                        this.doReplaceAllReputationOnQuestionDetailsPage()
                    }, 1000)
                })
            } else if (isPostRevisionPage) {
                this.doReplaceAllReputationOnPostRevisionPage()
            } else if (isUserProfilePage) {
                this.doReplaceAllReputationOnUserProfilePage()
            } else if (isUserActivityPage) {
                this.doReplaceAllReputationOnUserActivityPage()
            } else if (isUserListPage) {
                this.doReplaceAllReputationOnUserListPage()
            }
        })
    }

    doJonSkeetifiedTheReputation(reputationString, reputationLength = 12, unit = true) {
        reputationString = jQuery.trim(reputationString.split(' ')[0])
        let reputation = 0

        if (reputationString.indexOf(',') > -1) {
            reputation = parseInt(reputationString.replace(/,/g, ''), 10)
        } else if (reputationString.indexOf('k') > -1) {
            reputation = parseFloat(reputationString.replace(/k/, '')) * 1000
        } else if (reputationString.indexOf('m') > -1) {
            reputation = parseFloat(reputationString.replace(/m/, '')) * 1000000
        } else {
            reputation = parseFloat(reputationString.replace(/\./g, ''))
        }

        const calculatedReputation = (reputation / this.jonSkeetReputation).toFixed(20)
        const jonSkeetifiedReputation = String(calculatedReputation).slice(0, reputationLength)

        if (unit) {
            return `${jonSkeetifiedReputation} ${this.jonSkeetName}`
        } else {
            return jonSkeetifiedReputation
        }
    }

    doGetJonSkeetReputation() {
        return new Promise((resolve, reject) => {
            const key = moment().format('YYYYMMDD')
            let jonSkeetReputation = parseInt(localStorage.getItem(key) || 0, 10)
            if (jonSkeetReputation) {
                this.jonSkeetReputation = jonSkeetReputation
                resolve()
            } else {
                const url = `https://stackoverflow.com/users/${this.jonSkeetId}/jon-skeet`
                jQuery.get(url).then((res) => {
                    const reputationUpdated = this.doParseReputationString(jQuery(res)
                        .find('[title="reputation"] .fs-title')
                        .html())
                    if (reputationUpdated) {
                        jonSkeetReputation = reputationUpdated
                        localStorage.setItem(key, reputationUpdated)
                    }
    
                    if (jonSkeetName == '') {
                        jonSkeetName = jQuery('.profile-user--name > div').html()
                    }
    
                    this.jonSkeetReputation = jonSkeetReputation
                    resolve()
                }).catch((err) => {
                    this.jonSkeetReputation = jonSkeetReputation
                    resolve()
                })
            }
        })
    }

    doReplaceMyReputation() {
        const target = jQuery('.my-profile .js-header-rep:not(.reputation-modified)')
        const jonSkeetifiedReputation = this.doJonSkeetifiedTheReputation(target.html())

        target.addClass('reputation-modified')
        target.html(jonSkeetifiedReputation)
    }

    doReplaceAllReputationOnQuestionTopPage() {
        jQuery('.reputation-score:not(.reputation-modified)').each((i, e) => {
            const each = jQuery(e)
            const jonSkeetifiedReputation = this.doJonSkeetifiedTheReputation(each.html())

            each.addClass('reputation-modified')
            each.html(jonSkeetifiedReputation)
        })
    }

    doReplaceAllReputationOnQuestionAllOrTaggedPage() {
        jQuery('.reputation-score:not(.reputation-modified)').each((i, e) => {
            const each = jQuery(e)
            const jonSkeetifiedReputation = this.doJonSkeetifiedTheReputation(each.html())
            console.log(each.html(), jonSkeetifiedReputation)

            each.addClass('reputation-modified')
            each.html(jonSkeetifiedReputation)
            each.css({
                'display': 'block',
                'margin-top': '2px'
            })
            each.next().css('margin-left', '-2px')
        })
    }

    doReplaceAllReputationOnQuestionDetailsPage() {
        jQuery('.post-signature .-flair .reputation-score:not(.reputation-modified)').each((i, e) => {
            const each = jQuery(e)
            const jonSkeetifiedReputation = this.doJonSkeetifiedTheReputation(each.html())

            each.addClass('reputation-modified')
            each.html(jonSkeetifiedReputation)
            each.css({
                'display': 'block',
                'margin-top': '2px'
            })
            each.next().css('margin-left', '-2px')
        })

        jQuery('a.comment-user[title*=reputation]:not(.reputation-modified)').each((i, e) => {
            const each = jQuery(e)
            const jonSkeetifiedReputation = this.doJonSkeetifiedTheReputation(each.attr('title'))
            
            each.addClass('reputation-modified')
            each.attr('title', `${jonSkeetifiedReputation} reputation`)
        })
    }

    doReplaceAllReputationOnPostRevisionPage() {
        jQuery('.user-info .user-details .reputation-score:not(.reputation-modified)').each((i, e) => {
            const each = jQuery(e)
            const jonSkeetifiedReputation = this.doJonSkeetifiedTheReputation(each.html())

            each.addClass('reputation-modified')
            each.html(jonSkeetifiedReputation)
            each.css({
                'display': 'block',
                'margin-top': '2px'
            })
            each.next().css('margin-left', '-2px')
        })
    }

    doReplaceAllReputationOnUserProfilePage() {
        const target = jQuery('.user-card .fs-title:not(.reputation-modified)')
        const jonSkeetifiedReputation = this.doJonSkeetifiedTheReputation(target.html())
        
        target.addClass('reputation-modified')
        target.html(jonSkeetifiedReputation)
        target.css('cssText', 'font-size: 1.1em !important; font-weight: bold')
        target.parent().css('display', 'block')

        jQuery('.profile-communities--item .fc-light:not(.reputation-modified)').each((i, e) => {
            const each = jQuery(e)
            const reputationString = each.html()
            const jonSkeetifiedReputationWithoutUnit = this.doJonSkeetifiedTheReputation(reputationString, 9, false)

            each.addClass('reputation-modified')
            each.html(jonSkeetifiedReputationWithoutUnit)
            
            const target2nd = each.next().find('strong:not(.reputation-modified)')
            
            target2nd.addClass('reputation-modified')
            target2nd.html(jonSkeetifiedReputationWithoutUnit)
        })

        jQuery('.profile-top-tags .grid--cell .grid .jc-end').each((i, e) => {
            jQuery(e).find('> div > div:eq(0) > span:eq(1):not(.reputation-modified)').each((i, e) => {
                const each = jQuery(e)
                const jonSkeetifiedReputation = this.doJonSkeetifiedTheReputation(each.html(), 12, false)

                each.addClass('reputation-modified')
                each.html(jonSkeetifiedReputation)
            })
        })
    }

    doReplaceAllReputationOnUserActivityPage() {

    }

    doReplaceAllReputationOnUserListPage() {

    }
}

jQuery(() => {
    new SkeetOverflow().run()
})