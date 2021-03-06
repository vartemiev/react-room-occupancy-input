describe('ChildrenInput', function () {
    'use strict';

    var assert = require('assert'),
        sinon = require('sinon'),
        massert = require('./helpers/massert'),
        ChildrenInput = require('../src/ChildrenInput'),
        ChildrenCountInput = require('../src/ChildrenCountInput'),
        ChildAgeInput = require('../src/ChildAgeInput'),
        intlMessages = require('../src/intlMessages'),
        React = require('react'),
        TestUtils = require('react/addons').addons.TestUtils;

    [
        'value',
        'onChange',
        'onInvalidAge',
        'onAgesBecomingValid'
    ].forEach(function (name) {
        it('declares the ' + name + ' property', function () {
            assert(ChildrenInput.propTypes[name]);
        });
    });

    it('defines the display name', function () {
        assert.strictEqual(typeof ChildrenInput.displayName, 'string');
    });

    describe('instance', function () {
        describe('HTML', function () {
            var element;

            beforeEach(function () {
                element = TestUtils.renderIntoDocument(
                    React.createElement(ChildrenInput, {
                        value: [],
                        onChange: function () {},
                        onInvalidAge: function () {},
                        onAgesBecomingValid: function () {},
                        messages: intlMessages().en
                    })
                ).getDOMNode();
            });

            it('has DIV as a top level tag', function () {
                assert.strictEqual(element.tagName, 'DIV');
            });

            it('has the top level class assigned', function () {
                massert.cssClass(element, 'room-occupancy-children');
            });
        });

        describe('rendering according to its pre-set value', function () {
            var component,
                element;

            beforeEach(function () {
                component = TestUtils.renderIntoDocument(
                    React.createElement(ChildrenInput, {
                        value: [{age: 0}, {age: 2}, {age: 12}],
                        onChange: function () {},
                        onInvalidAge: function () {},
                        onAgesBecomingValid: function () {},
                        messages: intlMessages().en
                    })
                );

                element = component.getDOMNode();
            });

            it('includes a referenced ChildrenCountInput', function () {
                assert(
                    TestUtils.isCompositeComponentWithType(component.refs.count, ChildrenCountInput)
                );
            });

            it('sets the count value', function () {
                assert.strictEqual(component.refs.count.props.value, 3);
            });

            it('displays the correct amount of age inputs', function () {
                assert.strictEqual(element.querySelectorAll('input[type=number]').length, 3);
            });

            [0, 2, 12].forEach(function (age, index) {
                it('includes the reference to the ChildAgeInput #' + index, function () {
                    assert(
                        TestUtils.isCompositeComponentWithType(
                            component.refs['age' + index],
                            ChildAgeInput
                        )
                    );
                });

                it('sets the age #' + index + ' value', function () {
                    assert.strictEqual(component.refs['age' + index].props.value, age);
                });
            });
        });

        describe('change handlers wiring', function () {
            var component;

            beforeEach(function () {
                component = TestUtils.renderIntoDocument(
                    React.createElement(ChildrenInput, {
                        value: [{age: 3}, {age: 9}],
                        onChange: function () {},
                        onInvalidAge: function () {},
                        onAgesBecomingValid: function () {},
                        messages: intlMessages().en
                    })
                );

                sinon.spy(component, 'handleAgeChange');
            });

            it('registeres a count change handler', function () {
                assert(component.refs.count.props.onChange);
                assert.strictEqual(component.refs.count.props.onChange, component.handleCountChange);
            });

            it('registers an indexed age change handler', function () {
                assert(component.refs.age1.props.onChange);
                component.refs.age1.props.onChange(8);

                assert(component.handleAgeChange.calledOnce);
                assert.deepEqual(component.handleAgeChange.args[0], [1, 8]);
            });
        });

        describe('handleCountChange', function () {
            var component,
                spy;

            beforeEach(function () {
                spy = sinon.spy();

                component = TestUtils.renderIntoDocument(
                    React.createElement(ChildrenInput, {
                        value: [{age: 4}, {age: 2}],
                        onChange: spy,
                        onInvalidAge: function () {},
                        onAgesBecomingValid: function () {},
                        messages: intlMessages().en
                    })
                );
            });

            describe('when the count is decreased', function () {
                beforeEach(function () {
                    component.handleCountChange(1);
                });

                it('triggers onChange', function () {
                    assert(spy.calledOnce);
                });

                it('calls onChange with the reduced children array', function () {
                    assert.deepEqual(spy.args[0][0], [{age: 4}]);
                });
            });

            describe('when the count is increased', function () {
                beforeEach(function () {
                    component.handleCountChange(3);
                });

                it('triggers onChange once', function () {
                    assert(spy.calledOnce);
                });

                it('calls onChange with an augmented children array', function () {
                    assert.deepEqual(spy.args[0][0], [{age: 4}, {age: 2}, {age: null}]);
                });
            });
        });

        describe('handleAgeChange when all ages are present', function () {
            var component,
                spy;

            beforeEach(function () {
                spy = sinon.spy();

                component = TestUtils.renderIntoDocument(
                    React.createElement(ChildrenInput, {
                        value: [{age: 6}, {age: 11}],
                        onChange: spy,
                        onInvalidAge: function () {},
                        onAgesBecomingValid: function () {},
                        messages: intlMessages().en
                    })
                );

                component.handleAgeChange(1, 10);
            });

            it('triggers onChange', function () {
                assert(spy.calledOnce);
            });

            it('triggers onChange with new children array', function () {
                assert.deepEqual(spy.args[0][0], [{age: 6}, {age: 10}]);
            });
        });

        describe('handleAgeChange when some age is absent', function () {
            var component,
                spy;

            beforeEach(function () {
                spy = sinon.spy();

                component = TestUtils.renderIntoDocument(
                    React.createElement(ChildrenInput, {
                        value: [{age: null}, {age: null}],
                        onChange: spy,
                        onInvalidAge: function () {},
                        onAgesBecomingValid: function () {},
                        messages: intlMessages().en
                    })
                );

                component.handleAgeChange(0, 0);
            });

            it('triggers onChange once', function () {
                assert(spy.calledOnce);
            });

            it('triggers onChange with the new value', function () {
                assert.deepEqual(spy.args[0][0], [{age: 0}, {age: null}]);
            });
        });

        describe('translatable with react-intl', function () {
            var element;

            beforeEach(function () {
                element = TestUtils.renderIntoDocument(
                    React.createElement(ChildrenInput, {
                        value: [{age: null}, {age: null}],
                        onChange: function () {},
                        onInvalidAge: function () {},
                        onAgesBecomingValid: function () {},
                        messages: {
                            'react-room-occupancy-input': {
                                children: 'Детей',
                                childrenAge: '{children, plural, =1 {Возраст ребёнка} other {Возраст детей}}',
                                adults: 'Взрослых'
                            }
                        }
                    })
                ).getDOMNode();
            });

            it('has correct translate for 2 children', function () {
                massert.contains(element.textContent, 'Возраст детей');
            });
        });

        describe('drafting state data', function () {
            var component;

            beforeEach(function () {
                component = TestUtils.renderIntoDocument(
                    React.createElement(ChildrenInput, {
                        value: [{age: 2}, {age: 4}],
                        onChange: function () {},
                        onInvalidAge: function () {},
                        onAgesBecomingValid: function () {},
                        messages: intlMessages().en
                    })
                );
            });

            it('is initially a false vector', function () {
                assert.deepEqual(component.state.drafting, [false, false]);
            });

            it('gets corresponding element updated on onChane(null)', function () {
                component.handleAgeChange(1, null);
                assert.deepEqual(component.state.drafting, [false, true]);
            });

            it('gets corresponding element restored on onChane(smth-valid)', function () {
                component.handleAgeChange(1, null);
                component.handleAgeChange(1, 5);
                assert.deepEqual(component.state.drafting, [false, false]);
            });

            it('is shortened on count reduction', function () {
                component.handleCountChange(1);
                assert.deepEqual(component.state.drafting, [false]);
            });

            it('is padded on count increase', function () {
                component.handleAgeChange(0, null);
                component.handleCountChange(3);
                assert.deepEqual(component.state.drafting, [true, false, false]);
            });

            it('considers 0 a valid age', function () {
                component.handleAgeChange(0, 0);
                assert.deepEqual(component.state.drafting, [false, false]);
            });
        });

        describe('newDraftingState', function () {
            var component,
                onInvalidAge,
                onAgesBecomingValid;

            beforeEach(function () {
                onInvalidAge = sinon.spy();
                onAgesBecomingValid = sinon.spy();

                component = TestUtils.renderIntoDocument(
                    React.createElement(ChildrenInput, {
                        value: [{age: null}, {age: null}],
                        onChange: function () {},
                        onInvalidAge: onInvalidAge,
                        onAgesBecomingValid: onAgesBecomingValid,
                        messages: intlMessages().en
                    })
                );
            });

            it('triggers onInvalidAge on a true in drafting vector', function () {
                component.newDraftingState([false, true]);
                assert(onInvalidAge.calledOnce);
            });

            it('triggers onAgesBecomingValid on all-false drafting vector', function () {
                component.newDraftingState([false, false]);
                assert(onAgesBecomingValid.calledOnce);
            });

            it('triggers no onAgesBecomingValid on a true in drafting vector', function () {
                component.newDraftingState([false, true]);
                assert(!onAgesBecomingValid.called);
            });

            it('triggers no onInvalidAge on all-false drafting vector', function () {
                component.newDraftingState([false, false]);
                assert(!onInvalidAge.calledOnce);
            });
        });
    });
});
