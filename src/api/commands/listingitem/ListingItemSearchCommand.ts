import * as Bookshelf from 'bookshelf';
import { inject, named } from 'inversify';
import { validate, request } from '../../../core/api/Validate';
import { Logger as LoggerType } from '../../../core/Logger';
import { Types, Core, Targets } from '../../../constants';
import { ListingItemService } from '../../services/ListingItemService';
import { RpcRequest } from '../../requests/RpcRequest';
import { ListingItem } from '../../models/ListingItem';
import { RpcCommandInterface } from '../RpcCommandInterface';
import { ListingItemSearchParams } from '../../requests/ListingItemSearchParams';

export class ListingItemSearchCommand implements RpcCommandInterface<Bookshelf.Collection<ListingItem>> {

    public log: LoggerType;
    public name: string;

    constructor(
        @inject(Types.Service) @named(Targets.Service.ListingItemService) public listingItemService: ListingItemService,
        @inject(Types.Core) @named(Core.Logger) public Logger: typeof LoggerType
    ) {
        this.log = new Logger(__filename);
        this.name = 'finditems';
    }

    /**
     * data.params[]:
     *  [0]: page, number
     *  [1]: pageLimit, number
     *  [2]: order, SearchOrder
     *  [3]: category, number|string, if string, try to find using key, can be null
     *  [4]: searchString, string, can be null
     *
     * @param data
     * @returns {Promise<ListingItem>}
     */
    @validate()
    public async execute( @request(RpcRequest) data: any): Promise<Bookshelf.Collection<ListingItem>> {
        return this.listingItemService.search({
            page: data.params[0] || 1,
            pageLimit: data.params[1] || 5,
            order: data.params[2] || 'ASC',
            category: data.params[3],
            searchString: data.params[4] || ''
        } as ListingItemSearchParams, data.params[5]);
    }

    public help(): string {
        return 'finditems [<page> [<pageLimit> [<order> [(<categoryId> | <categoryName>) [<searchString>]]]]]\n'
            + '    <page>                          - [optional] Numeric - The number page we want to\n'
            + '                                       view of search listing item results.\n'
            + '        <pageLimit>                 - [optional] Numeric - The number of results per\n'
            + '                                       page.\n'
            + '            <order>                 - ENUM{ASC} - The order of the returned results.\n'
            + '                <categoryId>        - [optional] Numeric - The ID identifying the\n'
            + '                                       category associated with the listing items\n'
            + '                                       we want to search for.\n'
            + '                <categoryName>      - [optional] String - The key identifying the\n'
            + '                                       category associated with the listing items\n'
            + '                                       we want to search for.\n'
            + '                    <searchString>  - [optional] String - A string that is used to\n'
            + '                                       find listing items by their titles.';
    }
}
