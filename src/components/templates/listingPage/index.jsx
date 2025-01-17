import Meta from 'components/organisms/meta';
import Shell from 'components/organisms/shell';
import Paginator from 'components/molecules/paginator';
import PageTitle from 'components/atoms/pageTitle';
import Image from 'components/atoms/image';
import PreviewCardList from 'components/organisms/previewCardList';
import ListingChips from 'components/atoms/listingChips';

/**
 * Renders a listing page.
 * Used to render the /list/p/1 page and any other listing pages.
 * Also used to render the /collections page.
 */
const ListingPage = ({
  slug,
  paginator = null,
  snippetList,
  listingName,
  listingDescription,
  listingSublinks = [],
  listingCover,
  pageDescription,
  structuredData,
}) => (
  <>
    <Meta
      title={structuredData ? structuredData.name : listingName}
      description={pageDescription}
      logoSrc={listingCover ? listingCover : undefined}
      structuredData={structuredData}
      canonical={slug}
    />
    <Shell>
      <div className='snippet-list-header g-c1 a-center'>
        <div className='md:order-2 md:f-right my-2 mx-3.5 f-center'>
          <Image
            src={listingCover}
            alt=''
            height='240'
            width='240'
            fetchpriority='high'
            className='br-md'
          />
        </div>
        <div>
          <PageTitle className='f-center md:f-left'>{listingName}</PageTitle>
          <p className='lh-2 mt-4 mx-3.5 mb-2 txt-100 fs-sm md:fs-md'>
            {listingDescription}
          </p>
        </div>
      </div>
      {listingSublinks.length ? <ListingChips items={listingSublinks} /> : null}
      <div className='g-c3'>
        <PreviewCardList contentItems={snippetList} />
        {paginator ? <Paginator paginator={paginator} /> : null}
      </div>
    </Shell>
  </>
);

export default ListingPage;
