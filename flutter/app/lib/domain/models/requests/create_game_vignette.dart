class CreateGameVignette {
  CreateGameVignette();

  Map<String, dynamic> toJson() {
    return {
      'original': {
        'width': 2,
        'height': 2,
        'data': [0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3],
      },
      'modify': {
        'width': 2,
        'height': 2,
        'data': [0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3]
      },
      'differenceRadius': 0,
      'name': 'test',
    };
  }
}




/**
 * 
 *     it('should return Accepted if the game is valid', async () => {
        const expectedIsValid = true;
        gameValidation.isNbDifferenceValid.resolves(expectedIsValid);
        gameInfo.addGameInfoWrapper.resolves();
        // eslint-disable-next-line @typescript-eslint/no-empty-function -- calls fake and return {}
        stub(gameController['socketManager'], 'refreshGames').callsFake(() => {});
        const expectedBody = {
            original: { width: 2, height: 2, data: [0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3] },
            modify: { width: 2, height: 2, data: [0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3] },
            differenceRadius: 0,
            name: 'test',
        };
        return supertest(expressApp).post('/api/game/card').send(expectedBody).expect(StatusCodes.CREATED);
    });
 */