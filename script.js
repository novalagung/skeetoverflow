class SkeetOverflow {

    constructor(jonSkeetId = '22656', jonSkeetName = 'Jon Skeet') {
        this.jonSkeetId = jonSkeetId
        this.jonSkeetName = jonSkeetName
        this.jonSkeetReputation = 0
    }

    async run() {
        await this.doGetJonSkeetReputation()

        const soUri = (document.URL.split('stackoverflow.com')[1] || '').replace(/\/$/, "")
        if (soUri.indexOf(`/users/${this.jonSkeetId}`) > -1) {
            alert(`You are currently opening StackOverflow profile page of the one, the living legend, ${this.jonSkeetName}`)
        }
        
        this.doReplaceMyReputation()

        if ((soUri.indexOf("/questions/") == 0) && (soUri.split('/')[2] == String(parseInt(soUri.split('/')[2], 10)))) {
            // console.log('question details page')
            this.doReplaceAllReputationOnQuestionDetailsPage()
        }else  if ((soUri == '') || (soUri.indexOf('/?tab') == 0) || soUri.indexOf('/questions') > -1 || soUri.indexOf('/unanswered') > -1) {
            // console.log('questions page')
            this.doReplaceAllReputationOnQuestionsListPage()
        } else if ((soUri.indexOf("/posts/") == 0) && (soUri.indexOf("revisions") > -1)) {
            // console.log('post revision page')
            this.doReplaceAllReputationOnPostRevisionPage()
        } else if ((soUri.indexOf("/users") == 0) && !(soUri.split('/users')[1])) {
            // console.log('list users page')
            this.doReplaceAllReputationOnListUsersPage()
        } else if (soUri.indexOf("/users") == 0) {
            // console.log('user page')
            this.doReplaceAllReputationOnUserPage()
        }
    }

    doParseReputationString(reputationString) {
        reputationString = jQuery.trim((reputationString || "").split(' ')[0])
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

        return reputation
    }

    doJonSkeetifyTheReputation(reputationString, reputationLength = 6) {
        const reputation = this.doParseReputationString(reputationString)

        // since jon skeet reputation is cached and it's very possible in one second delay his reputation is updated,
        // so we use this stupid technique to make sure the current reputation matches with his'.
        if (Math.abs(reputation - this.jonSkeetReputation) < 100000) {
            return 'The 1'
        }

        const scaledReputation = parseFloat(reputation / this.jonSkeetReputation) * 100
        var jonSkeetifiedReputation = 0
        if (scaledReputation > 0) {
            jonSkeetifiedReputation = scaledReputation.toFixed(reputationLength)
        }

        return `${jonSkeetifiedReputation}% of ${this.jonSkeetName.replace(/ /g, '')}`
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
                        .find('#stats > div.s-card.fc-light.bar-md > div > div:nth-child(1) > div')
                        .html())
                    if (reputationUpdated) {
                        jonSkeetReputation = reputationUpdated
                        localStorage.setItem(key, reputationUpdated)
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
        try {
            const target = jQuery('.s-user-card--rep.js-header-rep')
            const value = this.doJonSkeetifyTheReputation(target.attr('title').split(': ')[1] || '')
            target.addClass('reputation-modified')
            target.html(value)
        } catch (e) {
            console.log('you are not logged in')
        }
    }

    doReplaceAllReputationOnQuestionDetailsPage() {
        jQuery('.reputation-score:not(.reputation-modified)').each((i, e) => {
            const each = jQuery(e)
            const value = this.doJonSkeetifyTheReputation(each.html())
            each.addClass('reputation-modified')
            each.html(value)
        })
    }

    doReplaceAllReputationOnQuestionsListPage() {
        jQuery('.s-user-card--rep span:not(.reputation-modified)').each((i, e) => {
            const each = jQuery(e)
            const value = this.doJonSkeetifyTheReputation(each.html())
            each.addClass('reputation-modified')
            each.html(value)
        })
    }

    doReplaceAllReputationOnPostRevisionPage() {
        jQuery('.s-user-card--rep:not(.reputation-modified)').each((i, e) => {
            const each = jQuery(e)
            const value = this.doJonSkeetifyTheReputation(each.html())
            each.addClass('reputation-modified')
            each.html(value)
        })
    }

    doReplaceAllReputationOnListUsersPage() {
        const target = jQuery('.reputation-score:not(.reputation-modified)')
        const value = this.doJonSkeetifyTheReputation(target.html())
        target.addClass('reputation-modified')
        target.html(value)
    }

    doReplaceAllReputationOnUserPage() {
        // user activity page
        const targetActivity = jQuery('.fs-headline1:not(.reputation-modified)')
        const value1 = this.doJonSkeetifyTheReputation(targetActivity.html())
        targetActivity.addClass('reputation-modified')
        targetActivity.html(value1)
        
        // user profile page
        const target = jQuery('#stats > div.s-card.fc-light.bar-md > div > div:nth-child(1) > div:not(.reputation-modified)')
        const value2 = this.doJonSkeetifyTheReputation(target.html())
        target.addClass('reputation-modified')
        target.html(value2)
    }
}

jQuery(() => {
    new SkeetOverflow().run()
})