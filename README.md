# ajax-project
A dynamic HTML, CSS, and JavaScript solo project.

## Technologies Used

- JavaScript
- CSS3
- HTML5
- CSS3

## Live Demo

Try the application live at [https://rosemary-liu.github.io/ajax-project/](https://rosemary-liu.github.io/ajax-project/)

## Features

- Users can generate a list of question cards.
- User can click on a card to view and answer a question.
- User can view a list of cards of questions answered correctly.
- User can add a question to their favorites.
- User can view a list of cards of questions that were favorited.
- User can generate a new set of questions after all questions in current session have been answered.

## Preview

![SGT React](assets/sgt-react.gif)

## Development


### System Requirements

- Node.js 10 or higher
- NPM 6 or higher
- MongoDB 4 or higher

### Getting Started

1. Clone the repository.

    ```shell
    git clone https://github.com/Learning-Fuze/sgt-react
    cd sgt-react
    ```

1. Install all dependencies with NPM.

    ```shell
    npm install
    ```

1. Import the example database to MongoDB.

    ```shell
    mongoimport --db sgt-react database/dump.json
    ```

1. Start the project. Once started you can view the application by opening http://localhost:3000 in your browser.

    ```shell
    npm run dev
    ```
