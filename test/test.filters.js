var twig   = require("../twig").twig,
    should = require('should');

describe("Twig.js Filters ->", function() {
    // Encodings
    describe("url_encode ->", function() {
        it("should encode URLs", function() {
            var test_template = twig({data: '{{ "http://google.com/?q=twig.js"|url_encode() }}' });
            test_template.render().should.equal("http%3A%2F%2Fgoogle.com%2F%3Fq%3Dtwig.js" );
        });
    });
    describe("json_encode ->", function() { 
        it("should encode strings to json", function() {
            var test_template = twig({data: '{{ test|json_encode }}' });
            test_template.render({test:'value'}).should.equal('"value"' );
        });
        it("should encode numbers to json", function() {
            var test_template = twig({data: '{{ test|json_encode }}' });
            test_template.render({test:21}).should.equal('21' );
        });
        it("should encode arrays to json", function() {
            var test_template = twig({data: '{{ [1,"b",3]|json_encode }}' });
            test_template.render().should.equal('[1,"b",3]' );
        });
        it("should encode objects to json", function() {
            var test_template = twig({data: '{{ {"a":[1,"b",3]}|json_encode }}' });
            test_template.render().should.equal('{"a":[1,"b",3]}' );
        });
    });
    
    // String manipulation
    describe("upper ->", function() {
        it("should convert text to uppercase", function() {
            var test_template = twig({data: '{{ "hello"|upper }}' });
            test_template.render().should.equal("HELLO" );
        });
    });
    describe("lower ->", function() { 
        it("should convert text to lowercase", function() {
            var test_template = twig({data: '{{ "HELLO"|lower }}' });
            test_template.render().should.equal("hello" );
        });
    });
    describe("capitalize ->", function() { 
        it("should capitalize the first word in a string", function() {
            var test_template = twig({data: '{{ "hello world"|capitalize }}' });
            test_template.render().should.equal("Hello world" );
        });
    });
    describe("title ->", function() {
        it("should capitalize all the words in a string", function() {
            var test_template = twig({data: '{{ "hello world"|title }}' });
            test_template.render().should.equal("Hello World" );
        });
    });
    
    // String/Object/Array check
    describe("length ->", function() {
        it("should determine the length of a string", function() {
            var test_template = twig({data: '{{ "test"|length }}' });
            test_template.render().should.equal("4");
        });
        it("should determine the length of an array", function() {
            var test_template = twig({data: '{{ [1,2,4,76,"tesrt"]|length }}' });
            test_template.render().should.equal("5");
        });
        it("should determine the length of an object", function() {
            var test_template = twig({data: '{{ {"a": "b", "c": "1", "test": "test"}|length }}' });
            test_template.render().should.equal("3");
        });
    });
    
    // Array/object manipulation
    describe("sort ->", function() { 
        it("should sort an array", function() {
            var test_template = twig({data: '{{ [1,5,2,7]|sort }}' });
            test_template.render().should.equal("1,2,5,7" );
        
            test_template = twig({data: '{{ ["test","abc",2,7]|sort }}' });
            test_template.render().should.equal("2,7,abc,test" );
        });
        it("should sort an object", function() {
            var test_template = twig({data: "{% set obj =  {'c': 1,'d': 5,'t': 2,'e':7}|sort %}{% for key,value in obj|sort %}{{key}}:{{value}} {%endfor %}" });
            test_template.render().should.equal("c:1 t:2 d:5 e:7 " );
        
            test_template = twig({data: "{% set obj = {'m':'test','z':'abc','a':2,'y':7} %}{% for key,value in obj|sort %}{{key}}:{{value}} {%endfor %}" });
            test_template.render().should.equal("a:2 y:7 z:abc m:test " );
        });
    });
    describe("reverse ->", function() { 
        it("should reverse an array", function() {
            var test_template = twig({data: '{{ ["a", "b", "c"]|reverse }}' });
            test_template.render().should.equal("c,b,a" );
        });
        it("should reverse an object", function() {
        });
    });
    describe("keys ->", function() { 
        it("should return the keys of an array", function() {
            var test_template = twig({data: '{{ ["a", "b", "c"]|keys }}' });
            test_template.render().should.equal("0,1,2" );
        });
        it("should return the keys of an object", function() {
            var test_template = twig({data: '{{ {"a": 1, "b": 4, "c": 5}|keys }}' });
            test_template.render().should.equal("a,b,c" );
            
            test_template = twig({data: '{{ {"0":"a", "1":"b", "2":"c"}|keys }}' });
            test_template.render().should.equal("0,1,2" );
        });
    });
    describe("merge ->", function() {
        it("should merge two objects into an object", function() {
            // Object merging
            var test_template = twig({data: '{% set obj= {"a":"test", "b":"1"}|merge({"b":2,"c":3}) %}{% for key in obj|keys|sort %}{{key}}:{{obj[key]}} {%endfor %}' });
            test_template.render().should.equal('a:test b:2 c:3 ' );
        });
        it("should merge two arrays into and array", function() {
            // Array merging
            var test_template = twig({data: '{% set obj= ["a", "b"]|merge(["c", "d"]) %}{% for key in obj|keys|sort %}{{key}}:{{obj[key]}} {%endfor %}' });
            test_template.render().should.equal('0:a 1:b 2:c 3:d ' );
        });
        it("should merge an object and an array into an object", function() {
            // Mixed merging
            var test_template = twig({data: '{% set obj= ["a", "b"]|merge({"a": "c", "3":4}, ["c", "d"]) %}{% for key in obj|keys|sort %}{{key}}:{{obj[key]}} {%endfor %}' });
            test_template.render().should.equal('0:a 1:b 3:4 4:c 5:d a:c ' );
        
            // Mixed merging(2)
            test_template = twig({data: '{% set obj= {"1":"a", "a":"b"}|merge(["c", "d"]) %}{% for key in obj|keys %}{{key}}:{{obj[key]}} {%endfor %}' });
            test_template.render().should.equal('1:a a:b 2:c 3:d ' );
        });
    });
    describe("join ->", function() {
        it("should join all values in an object", function() {
            var test_template = twig({data: '{{ {"a":"1", "b": "b", "c":test}|join("-") }}' });
            test_template.render({"test": "t"}).should.equal("1-b-t" );
        });
        it("should joing all values in an array", function() {
            var test_template = twig({data: '{{ [1,2,4,76]|join }}' });
            test_template.render().should.equal("12476" );
            test_template = twig({data: '{{ [1+ 5,2,4,76]|join("-" ~ ".") }}' });
            test_template.render().should.equal("6-.2-.4-.76" );
        });
    });
    
    // Other
    describe("default ->", function() { 
        it("should not provide the default value if a key is defined and not empty", function() {
            var test_template = twig({data: '{{ var|default("Not Defined") }}' });
            test_template.render({"var":"value"}).should.equal("value" );
        });

        it("should provide a default value if a key is not defined", function() {
            var test_template = twig({data: '{{ var|default("Not Defined") }}' });
            test_template.render().should.equal("Not Defined" );
        });
        
        it("should provide a default value if a value is empty", function() {
            var test_template = twig({data: '{{ ""|default("Empty String") }}' });
            test_template.render().should.equal("Empty String" );
        
            test_template = twig({data: '{{ var.key|default("Empty Key") }}' });
            test_template.render({'var':{}}).should.equal("Empty Key" );
        });
    });

    describe("date ->", function() {
        // NOTE: these tests are currently timezone dependent
        it("should recognize timestamps", function() { 
            var template = twig({data: '{{ 27571323556134|date("d/m/Y @ H:i:s") }}'});
            template.render().should.equal("13/09/2843 @ 08:59:16" );
        });
        it("should recognize string date formats", function() { 
            var template = twig({data: '{{ "Tue Aug 14 08:52:15 +0000 2007"|date("d/m/Y @ H:i:s") }}'});
            template.render().should.equal("14/08/2007 @ 04:52:15" );
        });
    });
    
    it("should chain", function() {
        var test_template = twig({data: '{{ ["a", "b", "c"]|keys|reverse }}' });
        test_template.render().should.equal("2,1,0" );
    });
});