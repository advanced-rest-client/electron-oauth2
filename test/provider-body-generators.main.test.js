const { assert } = require('chai');
const { IdentityProvider } = require('../');

describe('Request body generators - main process', () => {
  const ID = 'test-instance-id';
  const params = {
    type: 'custom_grant',
    clientId: 'test client id',
    clientSecret: 'test client secret',
    authorizationUri: 'https://auth.domain.com',
    username: 'test username',
    password: 'test password',
    scopes: ['one', 'two'],
  };

  describe('_getCodeExchangeBody()', () => {
    let instance = /** @type IdentityProvider */ (null);
    before(() => {
      instance = new IdentityProvider(ID, { ...params });
    });
    it('Applies params to the body', () => {
      const result = instance._getCodeExchangeBody(params, 'test code');
      let compare = 'grant_type=authorization_code&client_id=test%20client%20id';
      compare += '&code=test%20code&client_secret=test%20client%20secret';
      assert.equal(result, compare);
    });
  });

  describe('_getClientCredentialsBody()', () => {
    let instance = /** @type IdentityProvider */ (null);
    beforeEach(() => {
      instance = new IdentityProvider(ID, { ...params });
    });

    it('grant_type is set', () => {
      const result = instance._getClientCredentialsBody({});
      assert.equal(result.indexOf('grant_type=client_credentials'), 0);
    });

    it('skips client_id is not set', () => {
      instance = new IdentityProvider(ID);
      const result = instance._getClientCredentialsBody({});
      assert.equal(result.indexOf('client_id='), -1);
    });

    it('skips client_secret is not set', () => {
      instance = new IdentityProvider(ID);
      const result = instance._getClientCredentialsBody({});
      assert.equal(result.indexOf('client_secret='), -1);
    });

    it('skips scope is not set', () => {
      instance = new IdentityProvider(ID);
      const result = instance._getClientCredentialsBody({});
      assert.equal(result.indexOf('scope='), -1);
    });
    it('client_id is set', () => {
      const result = instance._getClientCredentialsBody(params);
      assert.notEqual(result.indexOf('&client_id=test%20client%20id'), -1);
    });
    it('client_secret is set', () => {
      const result = instance._getClientCredentialsBody(params);
      assert.notEqual(result.indexOf('&client_secret=test%20client%20secret'), -1);
    });
    it('scope is set', () => {
      const result = instance._getClientCredentialsBody(params);
      assert.notEqual(result.indexOf('&scope=one%20two'), -1);
    });
  });

  describe('_getPasswordBody()', () => {
    let instance = /** @type IdentityProvider */ (null);
    beforeEach(() => {
      instance = new IdentityProvider(ID, { ...params });
    });

    it('grant_type is set', () => {
      const result = instance._getPasswordBody(params);
      assert.equal(result.indexOf('grant_type=password'), 0);
    });

    it('username is set', () => {
      const result = instance._getPasswordBody(params);
      assert.notEqual(result.indexOf('&username=test%20username'), -1);
    });

    it('password is set', () => {
      const result = instance._getPasswordBody(params);
      assert.notEqual(result.indexOf('&password=test%20password'), -1);
    });

    it('Skips client_id is not set', () => {
      instance = new IdentityProvider(ID);
      const copy = { ...params };
      delete copy.clientId;
      const result = instance._getPasswordBody(copy);
      assert.equal(result.indexOf('client_id='), -1);
    });
    it('Skips scope is not set', () => {
      instance.oauthConfig.scopes = undefined;
      const copy = { ...params };
      delete copy.scopes;
      const result = instance._getPasswordBody(copy);
      assert.equal(result.indexOf('scope='), -1);
    });
    it('client_id is set', () => {
      const result = instance._getPasswordBody(params);
      assert.notEqual(result.indexOf('&client_id=test%20client%20id'), -1);
    });
    it('scope is set', () => {
      const result = instance._getPasswordBody(params);
      assert.notEqual(result.indexOf('&scope=one%20two'), -1);
    });
  });
});
