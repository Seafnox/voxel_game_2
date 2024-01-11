export class HTMLParser {
    private parser: DOMParser = new DOMParser();

    parse(html: string): HTMLElement {
        let doc = this.parser.parseFromString(html, 'text/html');
        return doc.body.firstChild as HTMLElement;
    }
}
