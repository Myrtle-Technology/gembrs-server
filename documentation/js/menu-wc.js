'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">gembrs-server documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-AppModule-3d0321ffb217250b0c65e35a84f27ff271662cecc74f8ddad155c62c5be4a5d57b879f07d3c8947c3dac965dae395ceb7e9f0efeb9065d882510dc906f4a5bc6"' : 'data-target="#xs-controllers-links-module-AppModule-3d0321ffb217250b0c65e35a84f27ff271662cecc74f8ddad155c62c5be4a5d57b879f07d3c8947c3dac965dae395ceb7e9f0efeb9065d882510dc906f4a5bc6"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AppModule-3d0321ffb217250b0c65e35a84f27ff271662cecc74f8ddad155c62c5be4a5d57b879f07d3c8947c3dac965dae395ceb7e9f0efeb9065d882510dc906f4a5bc6"' :
                                            'id="xs-controllers-links-module-AppModule-3d0321ffb217250b0c65e35a84f27ff271662cecc74f8ddad155c62c5be4a5d57b879f07d3c8947c3dac965dae395ceb7e9f0efeb9065d882510dc906f4a5bc6"' }>
                                            <li class="link">
                                                <a href="controllers/AppController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AppModule-3d0321ffb217250b0c65e35a84f27ff271662cecc74f8ddad155c62c5be4a5d57b879f07d3c8947c3dac965dae395ceb7e9f0efeb9065d882510dc906f4a5bc6"' : 'data-target="#xs-injectables-links-module-AppModule-3d0321ffb217250b0c65e35a84f27ff271662cecc74f8ddad155c62c5be4a5d57b879f07d3c8947c3dac965dae395ceb7e9f0efeb9065d882510dc906f4a5bc6"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-3d0321ffb217250b0c65e35a84f27ff271662cecc74f8ddad155c62c5be4a5d57b879f07d3c8947c3dac965dae395ceb7e9f0efeb9065d882510dc906f4a5bc6"' :
                                        'id="xs-injectables-links-module-AppModule-3d0321ffb217250b0c65e35a84f27ff271662cecc74f8ddad155c62c5be4a5d57b879f07d3c8947c3dac965dae395ceb7e9f0efeb9065d882510dc906f4a5bc6"' }>
                                        <li class="link">
                                            <a href="injectables/AppService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AuthModule.html" data-type="entity-link" >AuthModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-AuthModule-a29d3875913c63649b00d7a842ee2564689f97d373283084db1b509eeb24c7e1fab74cb3d461543aedb9b0dc5263554e1414f9637ebf03fe85c5baac86f073c7"' : 'data-target="#xs-controllers-links-module-AuthModule-a29d3875913c63649b00d7a842ee2564689f97d373283084db1b509eeb24c7e1fab74cb3d461543aedb9b0dc5263554e1414f9637ebf03fe85c5baac86f073c7"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AuthModule-a29d3875913c63649b00d7a842ee2564689f97d373283084db1b509eeb24c7e1fab74cb3d461543aedb9b0dc5263554e1414f9637ebf03fe85c5baac86f073c7"' :
                                            'id="xs-controllers-links-module-AuthModule-a29d3875913c63649b00d7a842ee2564689f97d373283084db1b509eeb24c7e1fab74cb3d461543aedb9b0dc5263554e1414f9637ebf03fe85c5baac86f073c7"' }>
                                            <li class="link">
                                                <a href="controllers/AuthController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AuthModule-a29d3875913c63649b00d7a842ee2564689f97d373283084db1b509eeb24c7e1fab74cb3d461543aedb9b0dc5263554e1414f9637ebf03fe85c5baac86f073c7"' : 'data-target="#xs-injectables-links-module-AuthModule-a29d3875913c63649b00d7a842ee2564689f97d373283084db1b509eeb24c7e1fab74cb3d461543aedb9b0dc5263554e1414f9637ebf03fe85c5baac86f073c7"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AuthModule-a29d3875913c63649b00d7a842ee2564689f97d373283084db1b509eeb24c7e1fab74cb3d461543aedb9b0dc5263554e1414f9637ebf03fe85c5baac86f073c7"' :
                                        'id="xs-injectables-links-module-AuthModule-a29d3875913c63649b00d7a842ee2564689f97d373283084db1b509eeb24c7e1fab74cb3d461543aedb9b0dc5263554e1414f9637ebf03fe85c5baac86f073c7"' }>
                                        <li class="link">
                                            <a href="injectables/AuthService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/JwtStrategy.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >JwtStrategy</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/LocalStrategy.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LocalStrategy</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/TokenRepository.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TokenRepository</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/MailModule.html" data-type="entity-link" >MailModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-MailModule-aab12ef0dc948c76416d8da9ff2200f8a722e49862789c0f241a5cce81991d6fadc34c606e67776536e858b126a7f5c6e640c00f38ccc5d8c1629ec984a64abc"' : 'data-target="#xs-injectables-links-module-MailModule-aab12ef0dc948c76416d8da9ff2200f8a722e49862789c0f241a5cce81991d6fadc34c606e67776536e858b126a7f5c6e640c00f38ccc5d8c1629ec984a64abc"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-MailModule-aab12ef0dc948c76416d8da9ff2200f8a722e49862789c0f241a5cce81991d6fadc34c606e67776536e858b126a7f5c6e640c00f38ccc5d8c1629ec984a64abc"' :
                                        'id="xs-injectables-links-module-MailModule-aab12ef0dc948c76416d8da9ff2200f8a722e49862789c0f241a5cce81991d6fadc34c606e67776536e858b126a7f5c6e640c00f38ccc5d8c1629ec984a64abc"' }>
                                        <li class="link">
                                            <a href="injectables/ElasticMailService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ElasticMailService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/MailService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MailService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/MemberModule.html" data-type="entity-link" >MemberModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-MemberModule-906a64593a69c97f7754e7ef72a09298de8ece57172b25569cc285c405c29ff72ea38df9d9b309da426fd4391fde7628ed1923ef4357e4b3790f1ef898e7c9f4"' : 'data-target="#xs-controllers-links-module-MemberModule-906a64593a69c97f7754e7ef72a09298de8ece57172b25569cc285c405c29ff72ea38df9d9b309da426fd4391fde7628ed1923ef4357e4b3790f1ef898e7c9f4"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-MemberModule-906a64593a69c97f7754e7ef72a09298de8ece57172b25569cc285c405c29ff72ea38df9d9b309da426fd4391fde7628ed1923ef4357e4b3790f1ef898e7c9f4"' :
                                            'id="xs-controllers-links-module-MemberModule-906a64593a69c97f7754e7ef72a09298de8ece57172b25569cc285c405c29ff72ea38df9d9b309da426fd4391fde7628ed1923ef4357e4b3790f1ef898e7c9f4"' }>
                                            <li class="link">
                                                <a href="controllers/MemberController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MemberController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-MemberModule-906a64593a69c97f7754e7ef72a09298de8ece57172b25569cc285c405c29ff72ea38df9d9b309da426fd4391fde7628ed1923ef4357e4b3790f1ef898e7c9f4"' : 'data-target="#xs-injectables-links-module-MemberModule-906a64593a69c97f7754e7ef72a09298de8ece57172b25569cc285c405c29ff72ea38df9d9b309da426fd4391fde7628ed1923ef4357e4b3790f1ef898e7c9f4"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-MemberModule-906a64593a69c97f7754e7ef72a09298de8ece57172b25569cc285c405c29ff72ea38df9d9b309da426fd4391fde7628ed1923ef4357e4b3790f1ef898e7c9f4"' :
                                        'id="xs-injectables-links-module-MemberModule-906a64593a69c97f7754e7ef72a09298de8ece57172b25569cc285c405c29ff72ea38df9d9b309da426fd4391fde7628ed1923ef4357e4b3790f1ef898e7c9f4"' }>
                                        <li class="link">
                                            <a href="injectables/MemberRepository.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MemberRepository</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/MemberService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MemberService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/OrganizationModule.html" data-type="entity-link" >OrganizationModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-OrganizationModule-c619ac76f47925c4c9aebc1bc0b320dd1ef98115e15550f0d2d611885677da41b5cb5c4525ce7e71defff78df28cefe332589ae5afeb2c71ad4e10857083f4f3"' : 'data-target="#xs-controllers-links-module-OrganizationModule-c619ac76f47925c4c9aebc1bc0b320dd1ef98115e15550f0d2d611885677da41b5cb5c4525ce7e71defff78df28cefe332589ae5afeb2c71ad4e10857083f4f3"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-OrganizationModule-c619ac76f47925c4c9aebc1bc0b320dd1ef98115e15550f0d2d611885677da41b5cb5c4525ce7e71defff78df28cefe332589ae5afeb2c71ad4e10857083f4f3"' :
                                            'id="xs-controllers-links-module-OrganizationModule-c619ac76f47925c4c9aebc1bc0b320dd1ef98115e15550f0d2d611885677da41b5cb5c4525ce7e71defff78df28cefe332589ae5afeb2c71ad4e10857083f4f3"' }>
                                            <li class="link">
                                                <a href="controllers/OrganizationController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >OrganizationController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-OrganizationModule-c619ac76f47925c4c9aebc1bc0b320dd1ef98115e15550f0d2d611885677da41b5cb5c4525ce7e71defff78df28cefe332589ae5afeb2c71ad4e10857083f4f3"' : 'data-target="#xs-injectables-links-module-OrganizationModule-c619ac76f47925c4c9aebc1bc0b320dd1ef98115e15550f0d2d611885677da41b5cb5c4525ce7e71defff78df28cefe332589ae5afeb2c71ad4e10857083f4f3"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-OrganizationModule-c619ac76f47925c4c9aebc1bc0b320dd1ef98115e15550f0d2d611885677da41b5cb5c4525ce7e71defff78df28cefe332589ae5afeb2c71ad4e10857083f4f3"' :
                                        'id="xs-injectables-links-module-OrganizationModule-c619ac76f47925c4c9aebc1bc0b320dd1ef98115e15550f0d2d611885677da41b5cb5c4525ce7e71defff78df28cefe332589ae5afeb2c71ad4e10857083f4f3"' }>
                                        <li class="link">
                                            <a href="injectables/OrganizationRepository.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >OrganizationRepository</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/OrganizationService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >OrganizationService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ResourceModule.html" data-type="entity-link" >ResourceModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-ResourceModule-6687912552e1bcc176a97f7ef8b2ba2f9d69cb0aa95e994ff6bc7c1f7dad0201c121b0478a081054d00bdc4861f4ad7cd4d57b0028a017e96e5b614161e8ff30"' : 'data-target="#xs-controllers-links-module-ResourceModule-6687912552e1bcc176a97f7ef8b2ba2f9d69cb0aa95e994ff6bc7c1f7dad0201c121b0478a081054d00bdc4861f4ad7cd4d57b0028a017e96e5b614161e8ff30"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-ResourceModule-6687912552e1bcc176a97f7ef8b2ba2f9d69cb0aa95e994ff6bc7c1f7dad0201c121b0478a081054d00bdc4861f4ad7cd4d57b0028a017e96e5b614161e8ff30"' :
                                            'id="xs-controllers-links-module-ResourceModule-6687912552e1bcc176a97f7ef8b2ba2f9d69cb0aa95e994ff6bc7c1f7dad0201c121b0478a081054d00bdc4861f4ad7cd4d57b0028a017e96e5b614161e8ff30"' }>
                                            <li class="link">
                                                <a href="controllers/ResourceController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ResourceController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-ResourceModule-6687912552e1bcc176a97f7ef8b2ba2f9d69cb0aa95e994ff6bc7c1f7dad0201c121b0478a081054d00bdc4861f4ad7cd4d57b0028a017e96e5b614161e8ff30"' : 'data-target="#xs-injectables-links-module-ResourceModule-6687912552e1bcc176a97f7ef8b2ba2f9d69cb0aa95e994ff6bc7c1f7dad0201c121b0478a081054d00bdc4861f4ad7cd4d57b0028a017e96e5b614161e8ff30"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ResourceModule-6687912552e1bcc176a97f7ef8b2ba2f9d69cb0aa95e994ff6bc7c1f7dad0201c121b0478a081054d00bdc4861f4ad7cd4d57b0028a017e96e5b614161e8ff30"' :
                                        'id="xs-injectables-links-module-ResourceModule-6687912552e1bcc176a97f7ef8b2ba2f9d69cb0aa95e994ff6bc7c1f7dad0201c121b0478a081054d00bdc4861f4ad7cd4d57b0028a017e96e5b614161e8ff30"' }>
                                        <li class="link">
                                            <a href="injectables/ResourceRepository.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ResourceRepository</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ResourceService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ResourceService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/RoleModule.html" data-type="entity-link" >RoleModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-RoleModule-93266a9d5e4946ef0ca5808394845b94e9229b05f3281fa6ba8493484c4f1fecaad5cbd65fd0affb484cb2c5b670fd4fdb399b425f51ad0563be05f5ef7002e2"' : 'data-target="#xs-controllers-links-module-RoleModule-93266a9d5e4946ef0ca5808394845b94e9229b05f3281fa6ba8493484c4f1fecaad5cbd65fd0affb484cb2c5b670fd4fdb399b425f51ad0563be05f5ef7002e2"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-RoleModule-93266a9d5e4946ef0ca5808394845b94e9229b05f3281fa6ba8493484c4f1fecaad5cbd65fd0affb484cb2c5b670fd4fdb399b425f51ad0563be05f5ef7002e2"' :
                                            'id="xs-controllers-links-module-RoleModule-93266a9d5e4946ef0ca5808394845b94e9229b05f3281fa6ba8493484c4f1fecaad5cbd65fd0affb484cb2c5b670fd4fdb399b425f51ad0563be05f5ef7002e2"' }>
                                            <li class="link">
                                                <a href="controllers/RoleController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RoleController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-RoleModule-93266a9d5e4946ef0ca5808394845b94e9229b05f3281fa6ba8493484c4f1fecaad5cbd65fd0affb484cb2c5b670fd4fdb399b425f51ad0563be05f5ef7002e2"' : 'data-target="#xs-injectables-links-module-RoleModule-93266a9d5e4946ef0ca5808394845b94e9229b05f3281fa6ba8493484c4f1fecaad5cbd65fd0affb484cb2c5b670fd4fdb399b425f51ad0563be05f5ef7002e2"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-RoleModule-93266a9d5e4946ef0ca5808394845b94e9229b05f3281fa6ba8493484c4f1fecaad5cbd65fd0affb484cb2c5b670fd4fdb399b425f51ad0563be05f5ef7002e2"' :
                                        'id="xs-injectables-links-module-RoleModule-93266a9d5e4946ef0ca5808394845b94e9229b05f3281fa6ba8493484c4f1fecaad5cbd65fd0affb484cb2c5b670fd4fdb399b425f51ad0563be05f5ef7002e2"' }>
                                        <li class="link">
                                            <a href="injectables/RoleRepository.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RoleRepository</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/RoleService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RoleService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/SmsModule.html" data-type="entity-link" >SmsModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-SmsModule-b5e2b24d57d61f598d99668895e3c13de3537c4f9425e3807a11f0386d065fc8ed0f39ca97bf19f2be4e67017f772011e41fff4e1d7ef3f294b9cf1181f5b8f9"' : 'data-target="#xs-injectables-links-module-SmsModule-b5e2b24d57d61f598d99668895e3c13de3537c4f9425e3807a11f0386d065fc8ed0f39ca97bf19f2be4e67017f772011e41fff4e1d7ef3f294b9cf1181f5b8f9"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-SmsModule-b5e2b24d57d61f598d99668895e3c13de3537c4f9425e3807a11f0386d065fc8ed0f39ca97bf19f2be4e67017f772011e41fff4e1d7ef3f294b9cf1181f5b8f9"' :
                                        'id="xs-injectables-links-module-SmsModule-b5e2b24d57d61f598d99668895e3c13de3537c4f9425e3807a11f0386d065fc8ed0f39ca97bf19f2be4e67017f772011e41fff4e1d7ef3f294b9cf1181f5b8f9"' }>
                                        <li class="link">
                                            <a href="injectables/SmsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SmsService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/TermiiService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TermiiService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/UserModule.html" data-type="entity-link" >UserModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-UserModule-19607d8b07052fe2d5ceedcae8f2bd8bbba8ff5d15637b07518fcf00a43834998d46ccc46274965fb9daacbf822937a844a7ca68b3b15095623871cedff43521"' : 'data-target="#xs-controllers-links-module-UserModule-19607d8b07052fe2d5ceedcae8f2bd8bbba8ff5d15637b07518fcf00a43834998d46ccc46274965fb9daacbf822937a844a7ca68b3b15095623871cedff43521"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-UserModule-19607d8b07052fe2d5ceedcae8f2bd8bbba8ff5d15637b07518fcf00a43834998d46ccc46274965fb9daacbf822937a844a7ca68b3b15095623871cedff43521"' :
                                            'id="xs-controllers-links-module-UserModule-19607d8b07052fe2d5ceedcae8f2bd8bbba8ff5d15637b07518fcf00a43834998d46ccc46274965fb9daacbf822937a844a7ca68b3b15095623871cedff43521"' }>
                                            <li class="link">
                                                <a href="controllers/UserController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-UserModule-19607d8b07052fe2d5ceedcae8f2bd8bbba8ff5d15637b07518fcf00a43834998d46ccc46274965fb9daacbf822937a844a7ca68b3b15095623871cedff43521"' : 'data-target="#xs-injectables-links-module-UserModule-19607d8b07052fe2d5ceedcae8f2bd8bbba8ff5d15637b07518fcf00a43834998d46ccc46274965fb9daacbf822937a844a7ca68b3b15095623871cedff43521"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-UserModule-19607d8b07052fe2d5ceedcae8f2bd8bbba8ff5d15637b07518fcf00a43834998d46ccc46274965fb9daacbf822937a844a7ca68b3b15095623871cedff43521"' :
                                        'id="xs-injectables-links-module-UserModule-19607d8b07052fe2d5ceedcae8f2bd8bbba8ff5d15637b07518fcf00a43834998d46ccc46274965fb9daacbf822937a844a7ca68b3b15095623871cedff43521"' }>
                                        <li class="link">
                                            <a href="injectables/UserRepository.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserRepository</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/UserService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                </ul>
                </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#controllers-links"' :
                                'data-target="#xs-controllers-links"' }>
                                <span class="icon ion-md-swap"></span>
                                <span>Controllers</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="controllers-links"' : 'id="xs-controllers-links"' }>
                                <li class="link">
                                    <a href="controllers/AppController.html" data-type="entity-link" >AppController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/AuthController.html" data-type="entity-link" >AuthController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/MailController.html" data-type="entity-link" >MailController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/MemberController.html" data-type="entity-link" >MemberController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/OrganizationController.html" data-type="entity-link" >OrganizationController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/ResourceController.html" data-type="entity-link" >ResourceController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/RoleController.html" data-type="entity-link" >RoleController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/UserController.html" data-type="entity-link" >UserController</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/AllErrorFilter.html" data-type="entity-link" >AllErrorFilter</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateAccountDto.html" data-type="entity-link" >CreateAccountDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateMemberDto.html" data-type="entity-link" >CreateMemberDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateOrganizationDto.html" data-type="entity-link" >CreateOrganizationDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateOrganizationPasswordDto.html" data-type="entity-link" >CreateOrganizationPasswordDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateResourceDto.html" data-type="entity-link" >CreateResourceDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateRoleDto.html" data-type="entity-link" >CreateRoleDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateTokenDto.html" data-type="entity-link" >CreateTokenDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateUserDto.html" data-type="entity-link" >CreateUserDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/DuplicateFieldError.html" data-type="entity-link" >DuplicateFieldError</a>
                            </li>
                            <li class="link">
                                <a href="classes/FindUserOrganization.html" data-type="entity-link" >FindUserOrganization</a>
                            </li>
                            <li class="link">
                                <a href="classes/InviteMemberDto.html" data-type="entity-link" >InviteMemberDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/LoginDto.html" data-type="entity-link" >LoginDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/Member.html" data-type="entity-link" >Member</a>
                            </li>
                            <li class="link">
                                <a href="classes/Organization.html" data-type="entity-link" >Organization</a>
                            </li>
                            <li class="link">
                                <a href="classes/QueryErrorFilter.html" data-type="entity-link" >QueryErrorFilter</a>
                            </li>
                            <li class="link">
                                <a href="classes/RegisterMember.html" data-type="entity-link" >RegisterMember</a>
                            </li>
                            <li class="link">
                                <a href="classes/Resource.html" data-type="entity-link" >Resource</a>
                            </li>
                            <li class="link">
                                <a href="classes/ResourceRole.html" data-type="entity-link" >ResourceRole</a>
                            </li>
                            <li class="link">
                                <a href="classes/Role.html" data-type="entity-link" >Role</a>
                            </li>
                            <li class="link">
                                <a href="classes/SharedService.html" data-type="entity-link" >SharedService</a>
                            </li>
                            <li class="link">
                                <a href="classes/TermiiRequestParams.html" data-type="entity-link" >TermiiRequestParams</a>
                            </li>
                            <li class="link">
                                <a href="classes/Token.html" data-type="entity-link" >Token</a>
                            </li>
                            <li class="link">
                                <a href="classes/TokenData.html" data-type="entity-link" >TokenData</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateMemberDto.html" data-type="entity-link" >UpdateMemberDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateMemberPasswordDto.html" data-type="entity-link" >UpdateMemberPasswordDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateOrganizationDto.html" data-type="entity-link" >UpdateOrganizationDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateResourceDto.html" data-type="entity-link" >UpdateResourceDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateRoleDto.html" data-type="entity-link" >UpdateRoleDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateUserDto.html" data-type="entity-link" >UpdateUserDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/User.html" data-type="entity-link" >User</a>
                            </li>
                            <li class="link">
                                <a href="classes/VerifyEmailDto.html" data-type="entity-link" >VerifyEmailDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/VerifyOtpDto.html" data-type="entity-link" >VerifyOtpDto</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AppService.html" data-type="entity-link" >AppService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AuthService.html" data-type="entity-link" >AuthService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ElasticMailService.html" data-type="entity-link" >ElasticMailService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/JwtAuthGuard.html" data-type="entity-link" >JwtAuthGuard</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/JwtStrategy.html" data-type="entity-link" >JwtStrategy</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/LocalAuthGuard.html" data-type="entity-link" >LocalAuthGuard</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/LocalStrategy.html" data-type="entity-link" >LocalStrategy</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/MailService.html" data-type="entity-link" >MailService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/MemberRepository.html" data-type="entity-link" >MemberRepository</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/MemberService.html" data-type="entity-link" >MemberService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/OrganizationRepository.html" data-type="entity-link" >OrganizationRepository</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/OrganizationService.html" data-type="entity-link" >OrganizationService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ResourceRepository.html" data-type="entity-link" >ResourceRepository</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ResourceService.html" data-type="entity-link" >ResourceService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/RoleRepository.html" data-type="entity-link" >RoleRepository</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/RoleService.html" data-type="entity-link" >RoleService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SharedRepository.html" data-type="entity-link" >SharedRepository</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SmsService.html" data-type="entity-link" >SmsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TermiiService.html" data-type="entity-link" >TermiiService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TokenRepository.html" data-type="entity-link" >TokenRepository</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UserRepository.html" data-type="entity-link" >UserRepository</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UserService.html" data-type="entity-link" >UserService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/IDoesNotExistParams.html" data-type="entity-link" >IDoesNotExistParams</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Media.html" data-type="entity-link" >Media</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PaginateQuery.html" data-type="entity-link" >PaginateQuery</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TermiiSendSmsResponse.html" data-type="entity-link" >TermiiSendSmsResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TokenRequest.html" data-type="entity-link" >TokenRequest</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});