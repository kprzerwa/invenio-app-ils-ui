import { http, apiConfig } from '../base';
import { serializer } from './serializer';

const listUrl = '/patrons/';
// Here we use a different url to access Patron details
// as patrons are only records indexed in elasticsearch
// but not stored in the database. Instead we are using
// `invenio_accounts_rest` users endpoint to retrieve
// individual patron's information.

const get = async patronPid => {
  const response = await http.get(`${listUrl}?q=id:${patronPid}`);
  response.data = serializer.fromJSON(response.data.hits.hits[0]);
  return response;
};

const list = async queryText => {
  const response = await http.get(`${listUrl}?q=${queryText}*`);
  response.data.total = response.data.hits.total;
  response.data.hits = response.data.hits.hits.map(hit =>
    serializer.fromJSON(hit)
  );
  return response;
};

export const patronApi = {
  searchBaseURL: `${apiConfig.baseURL}${listUrl}`,
  get: get,
  list: list,
};
