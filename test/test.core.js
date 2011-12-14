var twig   = require("../twig").twig,
    should = require('should');

describe("Twig.js Core ->", function() {
    it("should save and load a template by reference", function() {

        // Define and save a template
        twig({
            id:   'test',
            data: '{{ "test" }}'
        });

        // Load and render the template
        twig({ref: 'test'}).render()
                .should.equal("test");
    });

    it("should be able to parse output tags with tag ends in strings", function() {
        // Really all we care about here is not throwing exceptions.
        twig({data: '{{ "test" }}'}).render().should.equal("test");
        twig({data: '{{ " }} " }}'}).render().should.equal(" }} ");
        twig({data: '{{ " \\"}} " }}'}).render().should.equal(' "}} ');
        twig({data: "{{ ' }} ' }}"}).render().should.equal(" }} ");
        twig({data: "{{ ' \\'}} ' }}"}).render().should.equal(" '}} ");

        twig({data: '{{ " \'}} " }}'}).render().should.equal(" '}} ");
        twig({data: "{{ ' \"}} ' }}"}).render().should.equal(' "}} ');
    });

    it("should be able to output numbers", function() {
        twig({data: '{{ 12 }}'}).render().should.equal( "12" );
        twig({data: '{{ 12.64 }}'}).render().should.equal( "12.64" );
        twig({data: '{{ 0.64 }}'}).render().should.equal("0.64" );
    });

    it("should be able to output strings", function() {
        twig({data: '{{ "double" }}'}).render().should.equal("double");
        twig({data: "{{ 'single' }}"}).render().should.equal('single');
        twig({data: '{{ "dou\'ble" }}'}).render().should.equal("dou'ble");
        twig({data: "{{ 'sin\"gle' }}"}).render().should.equal('sin"gle');
        twig({data: '{{ "dou\\"ble" }}'}).render().should.equal("dou\"ble");
        twig({data: "{{ 'sin\\'gle' }}"}).render().should.equal("sin'gle");
    });
    it("should be able to output arrays", function() {
         twig({data: '{{ [1] }}'}).render().should.equal("1" );
         twig({data: '{{ [1,2 ,3 ] }}'}).render().should.equal("1,2,3" );
         twig({data: '{{ [1,2 ,3 , val ] }}'}).render({val: 4}).should.equal("1,2,3,4" );
         twig({data: '{{ ["[to",\'the\' ,"string]" ] }}'}).render().should.equal('[to,the,string]' );
         twig({data: '{{ ["[to",\'the\' ,"str\\"ing]" ] }}'}).render().should.equal('[to,the,str"ing]' );
    });
    it("should be able to output parse expressions in an array", function() {
         twig({data: '{{ [1,2 ,1+2 ] }}'}).render().should.equal("1,2,3" );
         twig({data: '{{ [1,2 ,3 , "-", [4,5, 6] ] }}'}).render({val: 4}).should.equal("1,2,3,-,4,5,6" );
         twig({data: '{{ [a,b ,(1+2) * a ] }}'}).render({a:1,b:2}).should.equal("1,2,3" );
    });
    it("should be able to output variables", function() {
         twig({data: '{{ val }}'}).render({ val: "test"}).should.equal("test");
         twig({data: '{{ val }}'}).render({ val: function() {
                                                       return "test"
                                                   }}).should.equal("test");
    });
    
});

describe("Twig.js Expressions ->", function() {
    var numeric_test_data = [
        {a: 10, b: 15},
        {a: 0, b: 0},
        {a: 1, b: 11},
        {a: 10444, b: 0.5},
        {a: 1034, b: -53},
        {a: -56, b: -1.7},
        {a: 34, b: 0},
        {a: 14, b: 14}
    ];

    describe("Basic Operators ->", function() {
        it("should support dot key notation", function() {
            var test_template = twig({data: '{{ key.value }} {{ key.sub.test }}'});
            var output = test_template.render({
                key: {
                    value: "test",
                    sub: {
                        test: "value"
                    }
                }
            });
            output.should.equal("test value");
        });
        it("should support square bracket key notation", function() {
            var test_template = twig({data: '{{ key["value"] }} {{ key[\'sub\']["test"] }}'});
            var output = test_template.render({
                key: {
                    value: "test",
                    sub: {
                        test: "value"
                    }
                }
            });
            output.should.equal("test value");
        });
        it("should support mixed dot and bracket key notation", function() {
            var test_template = twig({data: '{{ key["value"] }} {{ key.sub[key.value] }} {{ s.t["u"].v["w"] }}'});
            var output = test_template.render({
                key: {
                    value: "test",
                    sub: {
                        test: "value"
                    }
                },
                s: { t: { u: { v: { w: 'x' } } } }
            });
            output.should.equal("test value x" );
        });

        var string_data = [
            {a: 'test', b: 'string'},
            {a: 'test', b: ''},
            {a: '', b: 'string'},
            {a: '', b: ''},
        ];

        it("should add numbers", function() {
            var test_template = twig({data: '{{ a + b }}'});
            numeric_test_data.forEach(function(pair) {
                var output = test_template.render(pair);
                     output.should.equal( (pair.a + pair.b).toString() );
            });
        });
        it("should subtract numbers", function() {
            var test_template = twig({data: '{{ a - b }}'});
            numeric_test_data.forEach(function(pair) {
                var output = test_template.render(pair);
                     output.should.equal( (pair.a - pair.b).toString() );
            });
        });
        it("should multiply numbers", function() {
            var test_template = twig({data: '{{ a * b }}'});
            numeric_test_data.forEach(function(pair) {
                var output = test_template.render(pair);
                     output.should.equal((pair.a * pair.b).toString() );
            });
        });
        it("should divide numbers", function() {
            var test_template = twig({data: '{{ a / b }}'});
            numeric_test_data.forEach(function(pair) {
                var output = test_template.render(pair);
                     output.should.equal((pair.a / pair.b).toString() );
            });
        });
        it("should concatanate values", function() {
            twig({data: '{{ "test" ~ a }}'}).render({a:1234}).should.equal("test1234");
            twig({data: '{{ a ~ "test" ~ a }}'}).render({a:1234}).should.equal("1234test1234");
            twig({data: '{{ "this" ~ "test" }}'}).render({a:1234}).should.equal("thistest");

            // Test numbers
            var test_template = twig({data: '{{ a ~ b }}'});
            numeric_test_data.forEach(function(pair) {
                var output = test_template.render(pair);
                output.should.equal(pair.a.toString() + pair.b.toString());
            });
            // Test strings
            test_template = twig({data: '{{ a ~ b }}'});
            string_data.forEach(function(pair) {
                var output = test_template.render(pair);
                output.should.equal(pair.a.toString() + pair.b.toString());
            });
        });
        it("should handle multiple chained operations", function() {
            var data = {a: 4.5, b: 10, c: 12,  d: -0.25, e:0, f: 65,  g: 21, h: -0.0002};
            var test_template = twig({data: '{{a/b+c*d-e+f/g*h}}'});
            var output = test_template.render(data);
            var expected = data.a / data.b + data.c * data.d - data.e + data.f / data.g * data.h;
            output.should.equal(expected.toString());
        });
        it("should handle parenthesis in chained operations", function() {
            var data = {a: 4.5, b: 10, c: 12,  d: -0.25, e:0, f: 65,  g: 21, h: -0.0002};
            var test_template = twig({data: '{{a   /(b+c )*d-(e+f)/(g*h)}}'});
            var output = test_template.render(data);
            var expected = data.a / (data.b + data.c) * data.d - (data.e + data.f) / (data.g * data.h);
            output.should.equal(expected.toString());
        });
    });

    describe("Comparison Operators ->", function() {
        var boolean_data = [
            {a: true, b: true},
            {a: true, b: false},
            {a: false, b: true},
            {a: false, b: false}
        ];
        it("should support less then", function() {
            var test_template = twig({data: '{{ a < b }}'});
            numeric_test_data.forEach(function(pair) {
                var output = test_template.render(pair);
                output.should.equal((pair.a < pair.b).toString() );
            });
        });
        it("should support less then or equal", function() {
            var test_template = twig({data: '{{ a <= b }}'});
            numeric_test_data.forEach(function(pair) {
                var output = test_template.render(pair);
                output.should.equal((pair.a <= pair.b).toString() );
            });
        });
        it("should support greater then", function() {
            var test_template = twig({data: '{{ a > b }}'});
            numeric_test_data.forEach(function(pair) {
                var output = test_template.render(pair);
                output.should.equal((pair.a > pair.b).toString() );
            });
        });
        it("should support greater then or equal", function() {
            var test_template = twig({data: '{{ a >= b }}'});
            numeric_test_data.forEach(function(pair) {
                var output = test_template.render(pair);
                output.should.equal((pair.a >= pair.b).toString() );
            });
        });
        it("should support equals", function() {
            var test_template = twig({data: '{{ a == b }}'});
            boolean_data.forEach(function(pair) {
                var output = test_template.render(pair);
                output.should.equal((pair.a == pair.b).toString() );
            });
        });
        it("should support not equals", function() {
            var test_template = twig({data: '{{ a != b }}'});
            boolean_data.forEach(function(pair) {
                var output = test_template.render(pair);
                output.should.equal((pair.a != pair.b).toString() );
            });
        });
        it("should support boolean or", function() {
            var test_template = twig({data: '{{ a || b }}'});
            boolean_data.forEach(function(pair) {
                var output = test_template.render(pair);
                output.should.equal((pair.a || pair.b).toString() );
            });
        });
        it("should support boolean and", function() {
            var test_template = twig({data: '{{ a && b }}'});
            boolean_data.forEach(function(pair) {
                var output = test_template.render(pair);
                output.should.equal((pair.a && pair.b).toString() );
            });
        });
        it("should support boolean not", function() {
            var test_template = twig({data: '{{ !a }}'});
            test_template.render({a:false}).should.equal(true.toString());
            test_template.render({a:true}).should.equal(false.toString());
        });
    });
});
